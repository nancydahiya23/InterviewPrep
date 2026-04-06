import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyAuth() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token");

  if (!token) return null;

  try {
    return jwt.verify(token.value, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}