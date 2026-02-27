import type { Metadata } from "next";
import { RegisterPageView } from "@/features/auth/components/register-page";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return <RegisterPageView />;
}
