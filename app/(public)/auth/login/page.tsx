import type { Metadata } from "next";
import { LoginPageView } from "@/features/auth/components/login-page";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return <LoginPageView />;
}
