import { GoogleGenAI } from "@google/genai";
import { AIActionType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const performAIAction = async (
  text: string, 
  action: AIActionType,
  context?: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  let prompt = "";
  
  switch (action) {
    case 'summarize':
      prompt = `Summarize the following note content concisely in bullet points:\n\n"${text}"`;
      break;
    case 'fix_grammar':
      prompt = `Fix the grammar and spelling of the following text, keeping the tone natural. Return only the corrected text:\n\n"${text}"`;
      break;
    case 'continue':
      prompt = `Continue writing the following text creatively. Keep the style consistent with the input:\n\n"${text}"\n\nExisting Title Context: ${context || 'None'}`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Could not generate response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("AI Service unavailable");
  }
};
