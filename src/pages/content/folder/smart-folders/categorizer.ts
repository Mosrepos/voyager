import { ConversationReference, Folder } from '../types';

export interface OrganizationSuggestion {
  conversationId: string;
  suggestedFolderId: string | null;
  suggestedFolderName?: string;
  confidence: number;
  reasoning: string;
  tags?: string[];
}

export interface OrganizationResult {
  success: boolean;
  suggestions: OrganizationSuggestion[];
  error?: string;
}

/**
 * Voyager Pro: AI-based chat categorizer
 * Uses Gemini API to suggest folders and tags for chats.
 */
export async function organizeConversationsWithAI(
  conversations: ConversationReference[],
  folders: Folder[],
  apiKey: string,
  useExistingFoldersOnly: boolean,
  defaultFolderId: string | null,
): Promise<OrganizationResult> {
  if (!apiKey) {
    return {
      success: false,
      suggestions: [],
      error: 'API key is required',
    };
  }

  if (conversations.length === 0) {
    return {
      success: true,
      suggestions: [],
    };
  }

  try {
    const folderList = folders
      .map((f) => `- \${f.name} (ID: \${f.id})`)
      .join('\n');

    const conversationList = conversations
      .map(
        (c) =>
          `- ID: \${c.conversationId}, Title: "\${c.title || 'Untitled'}"`,
      )
      .join('\n');

    const prompt = \`You are an AI assistant helping to organize conversations into folders.

\${useExistingFoldersOnly ? 'IMPORTANT: You can ONLY use the existing folders listed below. Do not suggest creating new folders.' : 'You can suggest using existing folders or creating new ones if needed.'}

Existing Folders:
\${folderList || 'No folders exist yet'}

\${defaultFolderId ? \`Default Folder ID for unclassifiable items: \${defaultFolderId}\` : ''}

Conversations to organize:
\${conversationList}

For each conversation, analyze its title, then suggest the most appropriate folder and up to 3 relevant tags.
\${useExistingFoldersOnly ? 'If no existing folder fits well, use the default folder ID if provided, or suggest null.' : 'If no existing folder fits, suggest a new folder name.'}

Respond with a JSON array of objects with this structure:
[
  {
    "conversationId": "conv-id",
    "suggestedFolderId": "folder-id-or-null",
    "suggestedFolderName": "New Folder Name (only if creating new)",
    "confidence": 0.95,
    "reasoning": "Brief explanation",
    "tags": ["Tag1", "Tag2"]
  }
]

Only return the JSON array, no other text.\`;

    const response = await fetch(
      \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=\${apiKey}\`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || \`API request failed: \${response.status}\`,
      );
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n/, '').replace(/\\n\`\`\`$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n/, '').replace(/\\n\`\`\`$/, '');
    }

    const suggestions: OrganizationSuggestion[] = JSON.parse(jsonText);

    return {
      success: true,
      suggestions,
    };
  } catch (error) {
    console.error('AI organization error:', error);
    return {
      success: false,
      suggestions: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Batch organize conversations with progress tracking
 */
export async function batchOrganizeConversations(
  conversations: ConversationReference[],
  folders: Folder[],
  apiKey: string,
  useExistingFoldersOnly: boolean,
  defaultFolderId: string | null,
  batchSize: number = 20,
  onProgress?: (processed: number, total: number) => void,
): Promise<OrganizationResult> {
  const allSuggestions: OrganizationSuggestion[] = [];
  const total = conversations.length;
  let processed = 0;

  for (let i = 0; i < conversations.length; i += batchSize) {
    const batch = conversations.slice(i, i + batchSize);
    const result = await organizeConversationsWithAI(
      batch,
      folders,
      apiKey,
      useExistingFoldersOnly,
      defaultFolderId,
    );

    if (!result.success) {
      return result;
    }

    allSuggestions.push(...result.suggestions);
    processed += batch.length;

    if (onProgress) {
      onProgress(processed, total);
    }

    if (i + batchSize < conversations.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return {
    success: true,
    suggestions: allSuggestions,
  };
}
