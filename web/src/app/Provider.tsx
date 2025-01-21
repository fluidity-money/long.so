import "./globals.css";
import Web3ModalProvider from "@/context";
import { Toaster } from "@/components/ui/toaster";
import PostHogProvider from "@/providers/postHog";

/**
 * Providers which wrap the entire application
 */
export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <Web3ModalProvider>
      <PostHogProvider>{children}</PostHogProvider>
      <Toaster />
    </Web3ModalProvider>
  );
}
