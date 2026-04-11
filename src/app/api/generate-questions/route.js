import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// 1. Initialize the client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateWithRetry(prompt) {
  let retries = 3;

  while (retries > 0) {
    try {
      /**
       * 2. USE THE STABLE FREE MODEL: 'gemini-2.5-flash'
       * This is the current stable "workhorse" for free tier in 2026.
       * If this still 404s, use 'gemini-1.5-flash' but ensure your 
       * API key is from Google AI Studio (aistudio.google.com).
       */
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", 
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      // Directly access text from the new SDK response object
      return response.text; 
    } catch (err) {
      // 429 = Too many requests, 503 = Server busy
      if (err.status === 429 || err.status === 503) {
        console.warn("⏳ Google API busy, waiting 2 seconds...");
        await new Promise(res => setTimeout(res, 2000));
        retries--;
      } else {
        // If it's a 404, we log it clearly to help you debug
        if (err.status === 404) {
          console.error("❌ Model Name Error: The model identifier was not found.");
        }
        throw err;
      }
    }
  }
  throw new Error("API Limit Reached. Try again in 1 minute.");
}

export async function POST(req) {
  try {
    const { category, difficulty, type } = await req.json();

    if (!category || !difficulty || !type) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const prompt = type === "mcq" 
      ? `Generate 5 MCQ questions for ${category} (${difficulty}). JSON format: {"questions": [{"question": "str", "options": ["A","B","C","D"], "correctAnswer": "str"}]}`
      : `Generate 5 ${type} questions for ${category} (${difficulty}). JSON format: {"questions": [{"question": "str", "keywords": ["k1", "k2"]}]}`;

    const rawText = await generateWithRetry(prompt);

    // AI sometimes wraps JSON in backticks, let's strip them
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    return NextResponse.json({
      questions: parsed.questions || [],
    });

  } catch (error) {
    console.error("Critical Error:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}