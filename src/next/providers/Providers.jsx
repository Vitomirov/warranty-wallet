"use client";

import AuthProvider from "@/providers/AuthProvider";
import AiChat from "@/components/ai/AiChat";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <AiChat />
    </AuthProvider>
  );
}
