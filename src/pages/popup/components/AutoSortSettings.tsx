import React, { useEffect, useState } from 'react';

import { StorageKeys } from '../../../core/types/common';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Card, CardContent, CardTitle } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';

export function AutoSortSettings() {
  const { t } = useLanguage();
  const [isEnabled, setIsEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(
      [StorageKeys.GV_AUTOSORT_ENABLED, StorageKeys.GV_AUTOSORT_API_KEY],
      (result: { [key: string]: any }) => {
        setIsEnabled(result[StorageKeys.GV_AUTOSORT_ENABLED] === true);
        setApiKey(result[StorageKeys.GV_AUTOSORT_API_KEY] || '');
      }
    );
  }, []);

  const handleModeChange = (enabled: boolean) => {
    setIsEnabled(enabled);
    chrome.storage.sync.set({ [StorageKeys.GV_AUTOSORT_ENABLED]: enabled });
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setApiKey(val);
    chrome.storage.sync.set({ [StorageKeys.GV_AUTOSORT_API_KEY]: val });
  };

  return (
    <Card className="p-4 transition-all hover:shadow-md">
      <CardTitle className="mb-4">{t('autoSortSettings')}</CardTitle>
      <CardContent className="space-y-4 p-0">
        <p className="text-muted-foreground text-xs">{t('autoSortDescription')}</p>

        <div>
          <Label className="mb-2 block text-sm font-medium">{t('autoSortEnabled')}</Label>
          <div className="bg-secondary/60 relative grid grid-cols-2 gap-1 rounded-xl p-1">
            <div
              className="bg-primary pointer-events-none absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg shadow-sm transition-all duration-300 ease-out"
              style={{
                left: !isEnabled ? '4px' : 'calc(50% + 2px)',
              }}
            />
            <button
              className={`relative z-10 rounded-lg px-2 py-2 text-xs font-bold transition-all duration-200 ${
                !isEnabled
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => handleModeChange(false)}
            >
              {t('syncModeDisabled')}
            </button>
            <button
              className={`relative z-10 rounded-lg px-2 py-2 text-xs font-bold transition-all duration-200 ${
                isEnabled
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => handleModeChange(true)}
            >
              {t('syncModeManual')}
            </button>
          </div>
        </div>

        {isEnabled && (
          <div>
            <Label className="mb-2 block text-sm font-medium">{t('autoSortApiKey')}</Label>
            <input
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder={t('autoSortApiKeyPlaceholder')}
              className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
