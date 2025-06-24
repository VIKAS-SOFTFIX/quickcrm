import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | QuickCRM",
  description: "Login to your QuickCRM account",
};

export default function LoginPage() {
  return <LoginForm />;
} 