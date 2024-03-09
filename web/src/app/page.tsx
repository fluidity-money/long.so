import { Welcome } from "@/app/Welcome";
import { TokenModal } from "@/app/TokenModal";
import { SwapForm } from "@/app/SwapForm";

export default function Swap() {
  return (
    <>
      <TokenModal />
      <SwapForm />
      <Welcome />
    </>
  );
}
