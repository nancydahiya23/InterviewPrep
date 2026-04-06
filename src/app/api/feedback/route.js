import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { category, difficulty, score, answers } = await req.json();

    const prompt = `
You are an interview evaluator.

Candidate details:
Category: ${category}
Difficulty: ${difficulty}
Score: ${score}

Answers:
${answers.map((a, i) => `Q${i + 1}: ${a}`).join("\n")}

Give structured feedback in JSON:

{
  "strengths": ["point1", "point2"],
  "weaknesses": ["point1", "point2"],
  "improvements": ["point1", "point2"],
  "finalVerdict": "short summary"
}

Rules:
- No markdown
- No explanation outside JSON
- Max 2 points per section
- Each point short (1 line)
- Avoid long paragraphs
- Keep final verdict under 2 lines
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
    console.log("Feedback error:", err);
    return NextResponse.json(
      { message: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}