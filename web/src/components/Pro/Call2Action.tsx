import ArrowDown from "@/assets/icons/arrow-down-white.svg";
import { Button } from "../ui/button";
const Tabs = () => (
  <div className="flex items-center gap-1">
    <Button title="Market">Market</Button>
    <Button title="Limit">Limit</Button>
    <Button title="More" className="flex items-center gap-1">
      <span>More</span>
      <ArrowDown className="size-2.5" />
    </Button>
  </div>
);
export default function Call2Action() {
  return (
    <div className="flex flex-col gap-2">
      <Tabs />
    </div>
  );
}
