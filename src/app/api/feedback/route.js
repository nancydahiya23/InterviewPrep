import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { category, difficulty, score, answers } = await req.json();

    // Prepare the structured prompt
    const prompt = `
      You are an interview evaluator.
      Category: ${category} | Difficulty: ${difficulty} | Score: ${score}/5

      Candidate Answers:
      ${answers.map((a, i) => `Q${i + 1}: ${a}`).join("\n")}

      Return ONLY valid JSON:
      {
        "strengths": ["point1", "point2"],
        "weaknesses": ["point1", "point2"],
        "improvements": ["point1", "point2"],
        "finalVerdict": "short summary"
      }

      Rules:
      - Max 2 points per section
      - No markdown formatting
    `;

    // ✅ Match the working syntax from your generate-questions route
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using the stable 2026 model
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json", // Force JSON mode
      },
    });

    // Extract text safely
    let text = response.text?.trim() || "";

    // Remove any accidental markdown backticks just in case
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);

  } catch (err) {
    console.error("Feedback error:", err);
    return NextResponse.json(
      { message: "Failed to generate feedback", error: err.message },
      { status: 500 }
    );
  }
}