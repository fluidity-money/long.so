import { Badge } from "@/components/ui/badge";
import SPNTest from "@/assets/icons/spn-test.svg";
import ArrowDown from "@/assets/icons/arrow-down.svg";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { clsx } from "clsx";

export const NetworkSelection = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="group data-[state=open]:bg-amber-400">
        <Badge
          variant="invert"
          className={clsx(
            "absolute",
            "right-44",
            "hidden",
            "w-28",
            "px-0.5",
            "transition-[width]",
            "group-hover:w-[120px]",
            "group-data-[state=open]:w-[120px]",
            "md:inline-flex",
            "group-data-[state=open]:border-b-0",
            "group-data-[state=open]:rounded-b-none",
            "rounded-2xl",
          )}
        >
          <div className={"flex-col"}>
            <div className="flex flex-row items-center">
              <div className="mr-2">
                <SPNTest height={30} width={30} />
              </div>
              <div className="text-nowrap">SPN-Test</div>
              <div
                className={clsx(
                  "ml-2",
                  "transition-[width]",
                  "group-hover:inline-flex",
                  "group-hover:w-2",
                  "group-data-[state=open]:inline-flex",
                  "group-data-[state=open]:w-2",
                  "hidden",
                  "w-0",
                )}
              >
                <ArrowDown width={10} height={6} />
              </div>
            </div>
          </div>
        </Badge>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="relative -left-[62px] top-[34px] flex w-[120px] flex-col gap-1 rounded-2xl rounded-t-none border border-t-0 border-black bg-white p-2 ">
          <DropdownMenu.Item className="cursor-pointer p-1 text-xs">
            Ethereum
          </DropdownMenu.Item>
          <DropdownMenu.Item className="p-q cursor-pointer text-xs">
            Arbitrum
          </DropdownMenu.Item>
          <DropdownMenu.Item className="cursor-pointer p-1 text-xs">
            Solana
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
