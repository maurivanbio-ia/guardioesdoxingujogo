// pages/api/tts/elevenlabs.ts
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Endpoint ElevenLabs TTS
 * Converte texto em fala realista com base no modelo multilingual v2.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { text, voiceId = 'EXAVITQu4vr4xnSDxMaL', emotion = 'calm' } = req.body;

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: emotion === 'excited' ? 0.4 : emotion === 'sad' ? 0.8 : 0.6,
          similarity_boost: 0.85,
          style: emotion === 'excited' ? 0.9 : 0.2,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erro ElevenLabs: ${errText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (error: any) {
    console.error('[ElevenLabs TTS Error]', error);
    res.status(500).json({ error: error.message });
  }
}
