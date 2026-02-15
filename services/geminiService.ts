
import { GoogleGenAI } from "@google/genai";
import { MarketInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMarketInsights = async (market: string): Promise<MarketInsight> => {
  const prompt = `Analyze the current state of the ${market} stock market. 
  1. Provide a concise summary of current trends and performance (based on real-time info from Yahoo Finance/Bloomberg).
  2. Recommend the top 3 best-performing or most stable ETFs for this market right now.
  3. For each ETF, include: Ticker, Full Name, Estimated Expense Ratio, YTD Return, and a brief investment thesis.
  4. Mention if the risk level is Low, Medium, or High.
  Format your response as a structured report. Use search grounding for the most recent data.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const summary = response.text || "Unable to retrieve data at this time.";
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || "Market Source",
    uri: chunk.web?.uri || "#"
  })) || [];

  // Note: In a production app, we'd parse the structured text to JSON. 
  // For this demo, we'll return the raw text as summary and mock the ETF structure 
  // based on the AI's response content for UI rendering if we were doing strict parsing.
  // Here we'll treat the summary as the primary display content.
  
  return {
    summary,
    etfs: [], // Parsing complex lists from text is best done with responseSchema, but search grounding + schema has limitations.
    sources,
  };
};

export const getETFDetails = async (ticker: string): Promise<string> => {
    const prompt = `Provide a detailed investment analysis for the ETF with ticker: ${ticker}. 
    Include its holdings profile, historical performance vs benchmark, and current valuation metrics. 
    Use real-time data search.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    return response.text || "Detailed analysis currently unavailable.";
}
