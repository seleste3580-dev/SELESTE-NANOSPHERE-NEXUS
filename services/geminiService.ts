
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ADVISOR_SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  private cleanOutput(text: string): string {
    if (!text) return "";
    let cleaned = text
      .replace(/^(Sure|Certainly|Okay|Absolutely|Here is|I've synthesized|I can help|As a specialized).*?(\n|:|\.\s)/i, '')
      .replace(/^Here is the (academic|technical|lab|thesis|requested).*?:\n/i, '')
      .trim();
    if (cleaned.toLowerCase().startsWith("here is the")) {
       const lines = cleaned.split('\n');
       lines.shift();
       cleaned = lines.join('\n').trim();
    }
    return cleaned;
  }

  async editImage(base64Image: string, prompt: string, mimeType: string = 'image/png'): Promise<string | null> {
    try {
      const response = await this.getAI().models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: mimeType } },
            { text: `TRANSFORMATION PROTOCOL: Modify this image: "${prompt}". Output ONLY the image part.` },
          ],
        },
      });
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error: any) { throw new Error(error.message); }
  }

  async generateProImage(prompt: string, config: { aspectRatio: string; imageSize: string }): Promise<string | null> {
    try {
      const response = await this.getAI().models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio: config.aspectRatio as any,
            imageSize: config.imageSize as any
          }
        }
      });
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error: any) { throw new Error(error.message); }
  }

  async generateVideo(prompt: string, aspectRatio: '16:9' | '9:16', imageBase64?: string): Promise<string | null> {
    try {
      const ai = this.getAI();
      const params: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio }
      };
      if (imageBase64) {
        params.image = { imageBytes: imageBase64, mimeType: 'image/png' };
      }
      let operation = await ai.models.generateVideos(params);
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) return null;
      const resp = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await resp.blob();
      return URL.createObjectURL(blob);
    } catch (error: any) { throw new Error(error.message); }
  }

  async analyzeMedia(prompt: string, mediaBase64: string, mimeType: string): Promise<string> {
    const response = await this.getAI().models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [{ inlineData: { data: mediaBase64, mimeType } }, { text: prompt }]
      }
    });
    return response.text || "Analysis failed.";
  }

  async transcribeAudio(audioBase64: string): Promise<string> {
    const response = await this.getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [{ inlineData: { data: audioBase64, mimeType: 'audio/wav' } }, { text: "Transcribe this audio strictly." }]
      }
    });
    return response.text || "";
  }

  async generateSpeech(text: string): Promise<string | null> {
    const response = await this.getAI().models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
      }
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  }

  // Fixed: Added missing generateLabReport method to handle academic report synthesis
  async generateLabReport(code: string, name: string, reg: string): Promise<string> {
    const response = await this.getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Synthesize a formal academic laboratory report for Experiment ID: ${code}. 
      Scholar: ${name}. Registration: ${reg}. 
      Follow the University of Nairobi Department of Physics reporting standards. 
      Structure: Abstract, Objectives, Theoretical Background, Methodology, Expected Results, and Conclusion.`,
      config: { systemInstruction: ADVISOR_SYSTEM_INSTRUCTION },
    });
    return response.text || "Report generation failed.";
  }

  // Fixed: Added missing generateThesisDraft method for high-fidelity research drafting
  async generateThesisDraft(topic: string, faculty: string, keywords: string): Promise<string> {
    const response = await this.getAI().models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Architect a formal research thesis draft for the ${faculty}. 
      Research Topic: ${topic}. 
      Keywords: ${keywords}. 
      Include a comprehensive Problem Statement, Research Objectives, Methodology Framework, and a Roadmap for Literature Review.`,
      config: { systemInstruction: ADVISOR_SYSTEM_INSTRUCTION },
    });
    return response.text || "Thesis architecture synthesis failed.";
  }

  async *askAdvisorStream(question: string, options: { search?: boolean; maps?: boolean; complex?: boolean }): AsyncGenerator<{ text: string; grounding?: any[] }> {
    const model = options.complex ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    const config: any = {
      systemInstruction: ADVISOR_SYSTEM_INSTRUCTION,
      thinkingConfig: options.complex ? { thinkingBudget: 32768 } : undefined,
    };
    if (options.search) config.tools = [{ googleSearch: {} }];
    if (options.maps) {
      config.tools = [{ googleMaps: {} }];
      // Set to 2.5 flash if maps is needed
      if (!options.complex) (config as any).model = 'gemini-2.5-flash-lite-latest';
    }

    const response = await this.getAI().models.generateContentStream({
      model: options.maps && !options.complex ? 'gemini-2.5-flash-lite-latest' : model,
      contents: question,
      config,
    });

    let acc = "";
    for await (const chunk of response) {
      if (chunk.text) {
        acc += chunk.text;
        yield { text: acc, grounding: chunk.candidates?.[0]?.groundingMetadata?.groundingChunks };
      }
    }
  }

  async generateSlides(lessonTitle: string, lessonCode: string, courseName: string): Promise<any[]> {
    const response = await this.getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a 10-slide academic deck for: ${lessonCode} - ${lessonTitle}. JSON ONLY.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              points: { type: Type.ARRAY, items: { type: Type.STRING } },
              footer: { type: Type.STRING }
            },
            propertyOrdering: ["title", "points", "footer"]
          }
        }
      },
    });
    return JSON.parse(response.text?.trim() || "[]");
  }

  async *generateFullLessonStream(lessonTitle: string, lessonCode: string, courseName: string): AsyncGenerator<string> {
    const response = await this.getAI().models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: `SUBJECT: ${courseName}. MODULE: ${lessonCode} - ${lessonTitle}. Synthesize a full academic lecture. Markdown only.`,
      config: { systemInstruction: ADVISOR_SYSTEM_INSTRUCTION },
    });
    for await (const chunk of response) { if (chunk.text) yield chunk.text; }
  }
}

export const geminiService = new GeminiService();
