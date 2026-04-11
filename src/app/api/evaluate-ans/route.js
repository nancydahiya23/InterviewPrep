import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { question, answer } = await req.json();

    if (!question || !answer) {
      return NextResponse.json(
        { message: "Question and answer are required" },
        { status: 400 }
      );
    }

    const prompt = `
      You are a technical interviewer.
      Question: ${question}
      Candidate Answer: ${answer}

      Analyze the answer and return ONLY valid JSON:
      {
        "score": number,
        "missing_points": ["point1", "point2"],
        "feedback": "short feedback",
        "ideal_answer": "short ideal answer"
      }
      Rules:
      - Score should be from 1 to 10.
      - Keep feedback and ideal answer concise.
    `;

    // ✅ Using the stable 2026 model and correct syntax
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json", // This ensures JSON-only output
      },
    });

    // Extract text safely from the SDK response
    let text = response.text?.trim() || "";
    
    // Clean backticks if they appear
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Evaluation error:", err);
    return NextResponse.json(
      { message: "Evaluation failed", error: err.message },
      { status: 500 }
    );
  }
}