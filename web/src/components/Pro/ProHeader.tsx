import NavButton from "./NavButton";
import PairDetails from "./PairDetails";

export default function ProHeader() {
  return (
    <div className="flex items-center gap-4">
      <NavButton />
      <PairDetails />
    </div>
  );
}
