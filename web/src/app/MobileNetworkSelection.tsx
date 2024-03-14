import { Badge } from "@/components/ui/badge";
import SPNTest from "@/assets/icons/spn-test.svg";
import ArrowDown from "@/assets/icons/arrow-down.svg";

export const MobileNetworkSelection = () => {
  return (
    <Badge
      variant="invert"
      className={
        "group w-14 cursor-pointer border-primary-foreground px-0.5 pr-2 invert transition-[width] md:hidden"
      }
    >
      <div className={"flex-col"}>
        <div className="flex flex-row items-center">
          <div className="mr-2">
            <SPNTest height={30} width={30} />
          </div>
          <div className={"w-2"}>
            <ArrowDown width={10} height={6} />
          </div>
        </div>
      </div>
    </Badge>
  );
};
