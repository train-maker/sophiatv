// SophiaAI — Claude-powered chat endpoint
// Add your Anthropic API key to Vercel environment variables as: ANTHROPIC_API_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY is not configured. Add it in Vercel → Project Settings → Environment Variables.'
    });
  }

  const { messages, creatorMode } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const systemPrompt = creatorMode
    ? `You are SophiaAI, an expert AI assistant built into SophiaTV — the world's first AI-powered free speech video network. You help creators with:
- Writing compelling video titles and descriptions
- Suggesting relevant tags and keywords for discoverability
- Drafting professional replies to viewer comments
- Summarizing channel analytics and growth insights
- Content strategy and audience engagement tips
Be concise, practical, and enthusiastic about helping creators grow on SophiaTV.`
    : `You are SophiaAI, a friendly AI assistant built into SophiaTV — the world's first AI-powered free speech video network. You help viewers discover great content, answer questions about the platform, and assist with anything they need. Be concise, helpful, and enthusiastic.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.slice(-20), // keep last 20 messages for context
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: `Anthropic API error: ${err}` });
    }

    const data = await response.json();
    return res.status(200).json({ content: data.content[0].text });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach AI service' });
  }
}
