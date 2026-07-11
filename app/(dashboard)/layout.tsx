import { getServerSession } from "next-auth/next";
import { authOptions } from "@/nextAuth/authOptions";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }
  return <>{children}</>;
}
