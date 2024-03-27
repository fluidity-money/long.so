import { Welcome } from "@/app/Welcome";
import { TokenModal } from "@/app/TokenModal";
import { SwapForm } from "@/app/SwapForm";
import { SwapPro } from "@/components/SwapPro";

export default function Swap() {
  return (
    <div className="relative flex w-full flex-col">
      <TokenModal />

      <div className="flex max-w-full flex-col-reverse justify-center gap-8 lg:flex-row">
        <SwapPro />
        <SwapForm />
      </div>

      <Welcome />
    </div>
  );
}
