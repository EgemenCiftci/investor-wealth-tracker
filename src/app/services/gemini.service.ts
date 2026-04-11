import { inject, Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private readonly settingsService = inject(SettingsService);

  async generateInsight(snapshot: string): Promise<string> {
    const settings = await this.settingsService.getSettings();
    const apiKey = settings.geminiApiKey;
    if (!apiKey) {
      throw new Error('Gemini API key is not set. Please set it in the settings.');
    }
    const ai = new GoogleGenAI({
      apiKey,
    });

    const model = 'gemini-3-flash-preview';
    const config = {
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
      },
      systemInstruction: [{
        text: `You are a financial advisor. Provide a short 300-character insight about this data snapshot.`,
      }],
    };
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: snapshot,
          },
        ],
      },
    ];
    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });
    return response.text ?? '';
  }
}