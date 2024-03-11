import { Welcome } from "@/app/Welcome";
import { TokenModal } from "@/app/TokenModal";
import { SwapForm } from "@/app/SwapForm";
import { SwapPro } from "@/app/SwapPro";

export default function Swap() {
  return (
    <div className="flex max-h-screen flex-col">
      <TokenModal />

      <div className="flex flex-col-reverse justify-center gap-8 md:flex-row">
        <SwapPro />
        <SwapForm />
      </div>

      <Welcome />
    </div>
  );
}
