
import { GoogleGenAI, Type } from "@google/genai";
import { ADVISOR_SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  /**
   * Always initialize GoogleGenAI using the process.env.API_KEY directly.
   */
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  /**
   * Aggressively strips any conversational preamble, filler, or AI meta-talk.
   * Ensures the output starts strictly with the intended content.
   */
  private cleanOutput(text: string): string {
    if (!text) return "";
    
    // Remove typical AI filler phrases and multi-sentence introductions
    let cleaned = text
      .replace(/^(Sure|Certainly|Okay|Absolutely|Here is|I've synthesized|I can help|As a specialized).*?(\n|:|\.\s)/i, '')
      .replace(/^Here is the (academic|technical|lab|thesis|requested).*?:\n/i, '')
      .trim();

    // If the first line is still a repetitive "Here is...", remove it
    if (cleaned.toLowerCase().startsWith("here is the")) {
       const lines = cleaned.split('\n');
       lines.shift();
       cleaned = lines.join('\n').trim();
    }
      
    return cleaned;
  }

  async editImage(base64Image: string, prompt: string, mimeType: string = 'image/png'): Promise<string | null> {
    try {
      /**
       * Use generateContent for image editing tasks with gemini-2.5-flash-image.
       */
      const response = await this.getAI().models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: mimeType } },
            { text: `TRANSFORMATION PROTOCOL: Modify this technical schematic or image based on: "${prompt}". 
            CRITICAL: Output ONLY the image data. DO NOT provide any text, descriptions, or conversational filler.` },
          ],
        },
      });
      
      // Correctly iterate through candidates and parts to find the image data.
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    } catch (error: any) { throw new Error(error.message); }
  }

  async *generateFullLessonStream(lessonTitle: string, lessonCode: string, courseName: string): AsyncGenerator<string> {
    const prompt = `ACT AS A SENIOR ACADEMIC EDITOR. 
    SUBJECT: ${courseName}. 
    MODULE: ${lessonCode} - ${lessonTitle}.
    
    TASK: Synthesize a full-length, publication-quality academic lecture.
    STRICT COMPLIANCE RULES:
    1. NO CONVERSATIONAL FILLER. START DIRECTLY WITH THE TITLE.
    2. NO INTRODUCTIONS LIKE "Sure", "Here is", OR "Let's dive in".
    3. USE RIGOROUS TECHNICAL LANGUAGE AND MATHEMATICAL NOTATION.
    4. STRUCTURE: # [Title], Abstract, Core Theory, Circuit Analysis/Schematics, Mathematical Modeling, Real-World Application, Conclusion.`;
    
    const response = await this.getAI().models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: ADVISOR_SYSTEM_INSTRUCTION + " You are a machine that outputs ONLY structured Markdown academic content. No preamble." 
      },
    });
    
    let isFirstChunk = true;
    for await (const chunk of response) {
      if (chunk.text) {
        if (isFirstChunk) {
          const cleaned = this.cleanOutput(chunk.text);
          yield cleaned;
          isFirstChunk = false;
        } else {
          yield chunk.text;
        }
      }
    }
  }

  async generateThesisDraft(title: string, faculty: string, keywords: string): Promise<string> {
    const prompt = `FORMAL UNIVERSITY RESEARCH PROPOSAL.
    TOPIC: ${title}.
    FACULTY: ${faculty}.
    KEYWORDS: ${keywords}.
    
    STRICT INSTRUCTION: START IMMEDIATELY WITH THE DOCUMENT CONTENT. 
    NO GREETINGS. NO AI CHATTER. 
    FORMAT: 
    # RESEARCH PROPOSAL: [Title]
    ## 1. ABSTRACT
    ## 2. PROBLEM STATEMENT
    ## 3. SPECIFIC OBJECTIVES
    ## 4. THEORETICAL FRAMEWORK
    ## 5. METHODOLOGY
    ## 6. BIBLIOGRAPHIC DIRECTIONS`;
    
    const response = await this.getAI().models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { systemInstruction: "Output ONLY the structured research document. No conversation." }
    });
    // Use .text property as defined in guidelines.
    return this.cleanOutput(response.text || "Drafting interrupted.");
  }

  async generateLabReport(expCode: string, name: string, regNo: string): Promise<string> {
    const prompt = `OFFICIAL LABORATORY REPORT SYNTHESIS.
    STUDENT: ${name}. REG: ${regNo}. EXP_CODE: ${expCode}.
    
    STRICT RULES:
    1. START DIRECTLY WITH THE REPORT.
    2. ZERO AI PREAMBLE.
    3. SECTIONS: Title, Objectives, List of Apparatus, Theoretical Background, Detailed Procedure, Data Processing Logic, Error Estimation, Final Remarks.`;
    
    const response = await this.getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction: "Output ONLY the technical lab report. No greetings." }
    });
    // Use .text property.
    return this.cleanOutput(response.text || "Report generation failed.");
  }

  async *askQuestionStream(question: string): AsyncGenerator<string> {
    const response = await this.getAI().models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: { systemInstruction: ADVISOR_SYSTEM_INSTRUCTION + " Provide high-density technical responses. No conversational filler." },
    });
    let isFirstChunk = true;
    for await (const chunk of response) {
      if (chunk.text) {
        if (isFirstChunk) {
          yield this.cleanOutput(chunk.text);
          isFirstChunk = false;
        } else {
          yield chunk.text;
        }
      }
    }
  }

  async generateSlides(lessonTitle: string, lessonCode: string, courseName: string): Promise<any[]> {
    const prompt = `Generate a 10-slide academic deck for: ${lessonCode} - ${lessonTitle}. 
    Return strictly JSON. No text before or after.`;
    
    const response = await this.getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
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
            // Added propertyOrdering as per Type.OBJECT guidelines.
            propertyOrdering: ["title", "points", "footer"]
          }
        }
      },
    });
    // Access response.text property and trim for safety.
    return JSON.parse(response.text?.trim() || "[]");
  }
}

export const geminiService = new GeminiService();
