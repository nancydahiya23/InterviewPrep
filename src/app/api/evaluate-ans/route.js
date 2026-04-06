import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { question, answer } = await req.json();

    const prompt = `
You are a technical interviewer.

Question: ${question}
Candidate Answer: ${answer}

Return ONLY JSON:

{
  "score": number,
  "missing_points": ["point1", "point2"],
  "feedback": "short feedback",
  "ideal_answer": "short ideal answer"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text?.trim() || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { message: "Evaluation failed" },
      { status: 500 }
    );
  }
}