// lib/voiceSystem/ttsClient.ts
export async function generateSpeechElevenLabs(
  text: string,
  voiceId: string,
  emotion: "calm" | "excited" | "sad" = "calm"
) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: emotion === "excited" ? 0.4 : emotion === "sad" ? 0.8 : 0.6,
        similarity_boost: 0.85,
        style: emotion === "excited" ? 0.9 : 0.2,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) throw new Error(await response.text());
  const arrayBuffer = await response.arrayBuffer();
  return new Audio(URL.createObjectURL(new Blob([arrayBuffer])));
}
