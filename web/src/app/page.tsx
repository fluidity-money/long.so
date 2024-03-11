import { Welcome } from "@/app/Welcome";
import { TokenModal } from "@/app/TokenModal";
import { SwapForm } from "@/app/SwapForm";
import { SwapPro } from "@/app/SwapPro";

export default function Swap() {
  return (
    <div className="flex max-h-screen flex-col overflow-y-scroll">
      <TokenModal />

      <div className="flex flex-col-reverse justify-center md:flex-row">
        <SwapPro />
        <SwapForm />
      </div>

      <Welcome />
    </div>
  );
}
