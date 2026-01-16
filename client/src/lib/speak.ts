// lib/voiceSystem/speak.ts
import { VOICE_MAP } from "./voiceMap";
import { generateSpeechElevenLabs } from "./ttsClient";

export async function speak(
  text: string,
  speaker: keyof typeof VOICE_MAP,
  emotion: "calm" | "excited" | "sad" = "calm"
) {
  try {
    const voiceId = VOICE_MAP[speaker];
    const audio = await generateSpeechElevenLabs(text, voiceId, emotion);
    audio.play();
  } catch (error) {
    console.error("Erro ao gerar fala:", error);
  }
}
