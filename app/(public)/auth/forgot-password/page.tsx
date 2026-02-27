import type { Metadata } from "next";
import { ForgotPasswordPageView } from "@/features/auth/components/forgot-password-page";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageView />;
}
