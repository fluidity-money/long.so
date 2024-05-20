import "./globals.css";
import Web3ModalProvider from "@/context";

/**
 * Providers which wrap the entire application
 */
export function Provider({ children }: { children: React.ReactNode }) {
  return <Web3ModalProvider>{children}</Web3ModalProvider>;
}
