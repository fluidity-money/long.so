import { requestGetPairDetails } from "@/data";
import NavButton from "./NavButton";
import PairDetails from "./PairDetails";

export default function ProHeader({
  name,
  pairDetails,
  tokenAddress,
}: {
  name: string;
  tokenAddress: string;
  pairDetails: Awaited<ReturnType<typeof requestGetPairDetails>>;
}) {
  return (
    <div className="flex items-center gap-2">
      <NavButton name={name} />
      <PairDetails initialData={pairDetails} tokenAddress={tokenAddress} />
    </div>
  );
}
