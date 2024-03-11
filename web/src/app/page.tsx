import { Welcome } from "@/app/Welcome";
import { TokenModal } from "@/app/TokenModal";
import { SwapForm } from "@/app/SwapForm";
import { SwapPro } from "@/app/SwapPro";

export default function Swap() {
  return (
    <>
      <TokenModal />

      <div className="flex flex-row">
        <SwapPro />
        <SwapForm />
      </div>

      <Welcome />
    </>
  );
}
