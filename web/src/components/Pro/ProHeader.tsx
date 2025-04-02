import NavButton from "./NavButton";
import PairDetails from "./PairDetails";

export default function ProHeader({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-4">
      <NavButton name={name} />
      <PairDetails />
    </div>
  );
}
