import { SmartFolderConfig } from './types';

export interface SmartFolder {
  id: string;
  name: string;
  color?: string;
  isSmart: boolean;
  config: SmartFolderConfig;
}

export function createSmartFolderDraft(name: string): SmartFolder {
  return {
    id: crypto.randomUUID(),
    name,
    isSmart: true,
    config: {
      autoCategorize: true
    }
  };
}
