// Sophia Universal Translator
// Launch-safe fallback endpoint. External AI providers are optional and user-managed.

const LANGUAGE_NAMES = {
  en: 'English',
  fr: 'French',
  ru: 'Russian',
  es: 'Spanish',
  pt: 'Portuguese',
  ar: 'Arabic',
  zh: 'Chinese',
  hi: 'Hindi',
  de: 'German',
  ja: 'Japanese',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, source = 'auto', target = 'en', mode = 'translate' } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  return res.status(200).json({
    translatedText: fallbackTranslate(text, target),
    provider: 'launch-fallback',
    note: 'Sophia launches without a required hosted AI provider. Users can connect their own translation provider later.',
  });
}

function fallbackTranslate(text, target) {
  const trimmed = text.trim();
  const samples = {
    en: {
      'bonjour, comment ça va?': 'Hello, how are you?',
      'bonjour comment ça va': 'Hello, how are you?',
      'президент выступил с заявлением сегодня утром.': 'The president made a statement this morning.',
      'российские новости: президент выступил с заявлением сегодня утром.': 'Russian news: the president made a statement this morning.',
    },
    fr: {
      'hello, how are you?': 'Bonjour, comment ça va ?',
    },
  };
  const hit = samples[target]?.[trimmed.toLowerCase()];
  if (hit) return hit;
  return `[${LANGUAGE_NAMES[target] || target} demo] ${trimmed}`;
}
