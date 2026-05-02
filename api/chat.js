// Sophia AI chat endpoint — text + optional image (vision).
// Uses Claude (Anthropic) under the hood. Set ANTHROPIC_API_KEY in Vercel env.
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are Sophia AI — the operator assistant on SophiaTV, a global B2B marketplace and creator platform live in 105 countries.

Voice: warm, decisive, brief. Plain language a child could follow but with adult-grade insight. No fluff. Skip preambles.

When the user sends an image, describe what you see in 1-2 short sentences, then ask one focused follow-up question or surface one useful fact relevant to the operator (e.g. business identification, product analysis, market signal, listing improvement, wellness or food assessment, document or sign translation).

Stay under 60 words unless the user asks for more.`;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'POST only' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !apiKey.startsWith('sk-ant-')) {
    return res.status(200).json({
      reply: "Sophia AI is not yet wired — add a real ANTHROPIC_API_KEY in Vercel env vars to enable live vision and chat.",
      _placeholder: true,
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const { message, imageBase64, imageMediaType } = body;
  if (!message && !imageBase64) {
    return res.status(400).json({ error: 'Send a message or imageBase64.' });
  }

  const userContent = [];
  if (imageBase64) {
    let cleaned = imageBase64;
    let mediaType = imageMediaType || 'image/jpeg';
    if (cleaned.startsWith('data:')) {
      const m = cleaned.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (m) { mediaType = m[1]; cleaned = m[2]; }
    }
    userContent.push({
      type: 'image',
      source: { type: 'base64', media_type: mediaType, data: cleaned },
    });
  }
  userContent.push({ type: 'text', text: message || 'What do you see? Help me as a Sophia operator.' });

  try {
    const client = new Anthropic({ apiKey });
    const resp = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    });
    const text = (resp.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
    return res.status(200).json({ reply: text || '(empty response)', model: resp.model, usage: resp.usage });
  } catch (err) {
    console.error('chat error', err);
    return res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
}
