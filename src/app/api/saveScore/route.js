import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { difficulty, score } = await req.json();

    const user = await User.findById(decoded.id);

    user.interviewHistory.push({
      difficulty,
      score,
      date: new Date(),
    });

    await user.save();

    return NextResponse.json({ message: "Score saved successfully" });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" });
  }
}