import { describe, it, expect } from 'vitest';
import { createSmartFolderDraft } from '../smart-folders';

describe('Smart Folders', () => {
  it('should create a valid smart folder draft', () => {
    const folder = createSmartFolderDraft('Test Folder');
    expect(folder.name).toBe('Test Folder');
    expect(folder.isSmart).toBe(true);
    expect(folder.config.autoCategorize).toBe(true);
    expect(folder.id).toBeDefined();
  });
});
