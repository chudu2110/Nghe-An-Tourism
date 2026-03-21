import { GoogleGenAI, Modality } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAi(): GoogleGenAI | null {
  const apiKey = (process.env.GEMINI_API_KEY as string | undefined) ?? "";
  const trimmed = apiKey.trim();
  if (!trimmed) return null;
  if (!ai) ai = new GoogleGenAI({ apiKey: trimmed });
  return ai;
}

export async function generatePronunciation(text: string): Promise<string | null> {
  try {
    const aiClient = getAi();
    if (!aiClient) return null;

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Phát âm từ tiếng Nghệ An này một cách tự nhiên và ấm áp: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return `data:audio/mp3;base64,${base64Audio}`;
    }
    return null;
  } catch (error) {
    console.error("Error generating pronunciation:", error);
    return null;
  }
}
