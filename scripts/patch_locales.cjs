const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const locales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const translations = {
  en: {
    autoSortSettings: "Auto-Categorize Chats",
    autoSortDescription: "Automatically sort new chats into folders using Google AI Studio.",
    autoSortEnabled: "Enable Auto-Sort",
    autoSortApiKey: "Google AI Studio API Key",
    autoSortApiKeyPlaceholder: "Enter your Gemini API key"
  },
  de: {
    autoSortSettings: "Chats automatisch kategorisieren",
    autoSortDescription: "Neue Chats mit Google AI Studio automatisch in Ordner einsortieren.",
    autoSortEnabled: "Auto-Sortierung aktivieren",
    autoSortApiKey: "Google AI Studio API-Schlüssel",
    autoSortApiKeyPlaceholder: "Gemini API-Schlüssel eingeben"
  },
  es: {
    autoSortSettings: "Categorizar chats automáticamente",
    autoSortDescription: "Ordenar nuevos chats en carpetas usando Google AI Studio.",
    autoSortEnabled: "Habilitar categorización",
    autoSortApiKey: "Clave API de Google AI Studio",
    autoSortApiKeyPlaceholder: "Introduce tu clave API Gemini"
  },
  fr: {
    autoSortSettings: "Catégoriser automatiquement",
    autoSortDescription: "Trier automatiquement les nouveaux chats dans des dossiers via Google AI Studio.",
    autoSortEnabled: "Activer le tri auto",
    autoSortApiKey: "Clé API Google AI Studio",
    autoSortApiKeyPlaceholder: "Entrez votre clé API Gemini"
  },
  ja: {
    autoSortSettings: "チャットを自動分類",
    autoSortDescription: "Google AI Studioを使用して新しいチャットを自動的にフォルダに分類します。",
    autoSortEnabled: "自動分類を有効にする",
    autoSortApiKey: "Google AI Studio APIキー",
    autoSortApiKeyPlaceholder: "Gemini APIキーを入力"
  },
  ko: {
    autoSortSettings: "채팅 자동 분류",
    autoSortDescription: "Google AI Studio를 사용하여 새 채팅을 폴더에 자동으로 분류합니다.",
    autoSortEnabled: "자동 분류 활성화",
    autoSortApiKey: "Google AI Studio API 키",
    autoSortApiKeyPlaceholder: "Gemini API 키 입력"
  },
  pt: {
    autoSortSettings: "Categorizar chats automaticamente",
    autoSortDescription: "Organize novos chats em pastas automaticamente usando o Google AI Studio.",
    autoSortEnabled: "Ativar categorização automática",
    autoSortApiKey: "Chave de API do Google AI Studio",
    autoSortApiKeyPlaceholder: "Insira sua chave API Gemini"
  },
  ar: {
    autoSortSettings: "التصنيف التلقائي للدردشات",
    autoSortDescription: "فرز الدردشات الجديدة تلقائيًا في المجلدات باستخدام Google AI Studio.",
    autoSortEnabled: "تمكين الفرز التلقائي",
    autoSortApiKey: "مفتاح API لـ Google AI Studio",
    autoSortApiKeyPlaceholder: "أدخل مفتاح Gemini API الخاص بك"
  },
  ru: {
    autoSortSettings: "Автоматическая классификация чатов",
    autoSortDescription: "Автоматически сортировать новые чаты по папкам с помощью Google AI Studio.",
    autoSortEnabled: "Включить авто-сортировку",
    autoSortApiKey: "API-ключ Google AI Studio",
    autoSortApiKeyPlaceholder: "Введите ваш API-ключ Gemini"
  },
  zh: {
    autoSortSettings: "自动分类聊天",
    autoSortDescription: "使用 Google AI Studio 自动将新聊天分类到文件夹中。",
    autoSortEnabled: "启用自动分类",
    autoSortApiKey: "Google AI Studio API 密钥",
    autoSortApiKeyPlaceholder: "输入您的 Gemini API 密钥"
  },
  zh_TW: {
    autoSortSettings: "自動分類聊天",
    autoSortDescription: "使用 Google AI Studio 自動將新聊天分類到資料夾中。",
    autoSortEnabled: "啟用自動分類",
    autoSortApiKey: "Google AI Studio API 金鑰",
    autoSortApiKeyPlaceholder: "輸入您的 Gemini API 金鑰"
  }
};

for (const loc of locales) {
  const file = path.join(localesDir, loc, 'messages.json');
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const t = translations[loc] || translations['en'];
    
    data.autoSortSettings = { message: t.autoSortSettings };
    data.autoSortDescription = { message: t.autoSortDescription };
    data.autoSortEnabled = { message: t.autoSortEnabled };
    data.autoSortApiKey = { message: t.autoSortApiKey };
    data.autoSortApiKeyPlaceholder = { message: t.autoSortApiKeyPlaceholder };
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
    console.log(`Updated ${loc}/messages.json`);
  }
}
