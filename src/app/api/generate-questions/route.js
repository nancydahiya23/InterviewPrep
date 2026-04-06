import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { category, difficulty, type } = await req.json();

    if (!category || !difficulty || !type) {
      return NextResponse.json(
        { message: "Category, difficulty and type are required" },
        { status: 400 }
      );
    }

    let prompt = "";

    // ✅ MCQ TYPE
    if (type === "mcq") {
      prompt = `
Generate exactly 5 MCQ interview questions.

Category: ${category}
Difficulty: ${difficulty}

Return ONLY valid JSON:

{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "one of the options"
    }
  ]
}

Rules:
- 4 options per question
- only one correct answer
- no explanation
- no markdown
`;
    }

    // ✅ SHORT / LONG TYPE
    else {
      prompt = `
Generate exactly 5 interview questions.

Category: ${category}
Difficulty: ${difficulty}
Type: ${type}

Return ONLY valid JSON:

{
  "questions": [
    {
      "question": "string",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}

Rules:
- keywords should help evaluate answer
- no markdown
`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text?.trim() || "";

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(text);

    return NextResponse.json({
      questions: parsed.questions || [],
    });

  } catch (error) {
    console.log("Generate Questions Error:", error);
    return NextResponse.json(
      { message: "Failed to generate questions" },
      { status: 500 }
    );
  }
}