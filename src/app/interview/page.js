import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import InterviewUI from "./interviewUI";

export default async function InterviewPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return <InterviewUI />;
}