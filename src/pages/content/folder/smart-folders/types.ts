export interface SmartFolderConfig {
  autoCategorize: boolean;
  rules?: {
    keywords?: string[];
    aiPrompt?: string;
  };
}
