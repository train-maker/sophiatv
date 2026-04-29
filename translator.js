(() => {
  const root = document.getElementById('universalTranslator');
  if (!root) return;

  const sourceSelect = root.querySelector('#translatorSource');
  const targetSelect = root.querySelector('#translatorTarget');
  const input = root.querySelector('#translatorInput');
  const output = root.querySelector('#translatorOutput');
  const status = root.querySelector('#translatorStatus');
  const translateBtn = root.querySelector('#translatorRun');
  const speakBtn = root.querySelector('#translatorSpeak');
  const listenBtn = root.querySelector('#translatorListen');
  const swapBtn = root.querySelector('#translatorSwap');
  const sampleBtns = root.querySelectorAll('[data-translate-sample]');

  const recognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;

  function setStatus(message) {
    status.textContent = message;
  }

  async function translate(mode = 'translate') {
    const text = input.value.trim();
    if (!text) {
      input.focus();
      setStatus('Enter text or start speech capture.');
      return;
    }
    translateBtn.disabled = true;
    setStatus('Translating signal...');
    try {
      if (location.origin === 'http://127.0.0.1:4173' || location.origin === 'http://localhost:4173') {
        const fallback = clientFallback(text, targetSelect.value);
        output.value = fallback.translatedText;
        setStatus(fallback.note);
        return;
      }
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text,
          source: sourceSelect.value,
          target: targetSelect.value,
          mode,
        }),
      });
      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        data = clientFallback(text, targetSelect.value);
      }
      if (!res.ok) throw new Error(data.error || 'Translation failed');
      output.value = data.translatedText || '';
      setStatus(data.note || `Translated with ${data.provider || 'Sophia'}.`);
    } catch (err) {
      const fallback = clientFallback(text, targetSelect.value);
      output.value = fallback.translatedText;
      setStatus(fallback.note);
    } finally {
      translateBtn.disabled = false;
    }
  }

  function clientFallback(text, target) {
    const samples = {
      en: {
        'bonjour, comment ça va?': 'Hello, how are you?',
        'bonjour comment ça va': 'Hello, how are you?',
        'российские новости: президент выступил с заявлением сегодня утром.': 'Russian news: the president made a statement this morning.',
        'президент выступил с заявлением сегодня утром.': 'The president made a statement this morning.',
      },
      fr: {
        'hello, how are you?': 'Bonjour, comment ça va ?',
      },
    };
    const names = { en:'English', fr:'French', ru:'Russian', es:'Spanish', pt:'Portuguese', ar:'Arabic', zh:'Chinese', hi:'Hindi', de:'German', ja:'Japanese' };
    const hit = samples[target]?.[text.trim().toLowerCase()];
    return {
      translatedText: hit || `[${names[target] || target} local preview] ${text.trim()}`,
      provider: 'local-preview',
      note: 'Local preview fallback. Deploy on Vercel with ANTHROPIC_API_KEY for live AI translation.',
    };
  }

  function speak() {
    const text = output.value.trim();
    if (!text || !('speechSynthesis' in window)) {
      setStatus('Text-to-speech is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetSelect.value === 'auto' ? 'en-US' : `${targetSelect.value}-${targetSelect.value.toUpperCase()}`;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    setStatus('Speaking translated audio.');
  }

  function listen() {
    if (!recognitionApi) {
      setStatus('Speech-to-text is not available in this browser. Try Chrome or Safari.');
      return;
    }
    if (recognition) {
      recognition.stop();
      recognition = null;
      listenBtn.textContent = 'Start Speech Capture';
      setStatus('Speech capture stopped.');
      return;
    }
    recognition = new recognitionApi();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = sourceSelect.value === 'auto' ? 'en-US' : `${sourceSelect.value}-${sourceSelect.value.toUpperCase()}`;
    listenBtn.textContent = 'Stop Listening';
    setStatus('Listening...');
    recognition.onresult = (event) => {
      input.value = Array.from(event.results).map(result => result[0].transcript).join(' ');
    };
    recognition.onerror = () => setStatus('Speech capture could not start. Check browser microphone permission.');
    recognition.onend = () => {
      listenBtn.textContent = 'Start Speech Capture';
      recognition = null;
      if (input.value.trim()) translate();
    };
    recognition.start();
  }

  translateBtn.addEventListener('click', () => translate());
  speakBtn.addEventListener('click', speak);
  listenBtn.addEventListener('click', listen);
  swapBtn.addEventListener('click', () => {
    if (sourceSelect.value === 'auto') sourceSelect.value = 'en';
    const oldSource = sourceSelect.value;
    sourceSelect.value = targetSelect.value;
    targetSelect.value = oldSource;
    const oldInput = input.value;
    input.value = output.value;
    output.value = oldInput;
    setStatus('Languages swapped.');
  });
  sampleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.translateSample || '';
      sourceSelect.value = btn.dataset.source || 'auto';
      targetSelect.value = btn.dataset.target || 'en';
      translate('caption');
    });
  });
})();
