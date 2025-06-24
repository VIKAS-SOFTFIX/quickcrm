import { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | QuickCRM",
  description: "Create a new QuickCRM account",
};

export default function SignupPage() {
  return <SignupForm />;
} 