// pages/api/tts/openai.ts
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Endpoint OpenAI TTS (fallback)
 * Usa o modelo gpt-4o-mini-tts ou tts-1-hd para gerar fala natural.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { text, emotion = 'calm' } = req.body;

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-tts',
        voice: emotion === 'excited' ? 'alloy' : 'verse',
        input: text,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erro OpenAI TTS: ${errText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (error: any) {
    console.error('[OpenAI TTS Error]', error);
    res.status(500).json({ error: error.message });
  }
}
