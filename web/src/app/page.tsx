import { Welcome } from "@/app/Welcome";

import { SwapForm } from "@/components/SwapForm";
import { SwapPro } from "@/components/SwapPro";
import Link from "next/link";

export default function Swap() {
  return (
    <div className="relative flex w-full flex-col">
      <div className="flex max-w-full flex-col-reverse justify-center gap-8 lg:flex-row">
        <Link href={"/third"}>
          <span data-test="third-page-anchor">Go to third page </span>
        </Link>
        <SwapPro />
        <SwapForm />
      </div>

      <Welcome />
    </div>
  );
}
