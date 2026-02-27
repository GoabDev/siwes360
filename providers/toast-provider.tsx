"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "18px",
        },
      }}
    />
  );
}
