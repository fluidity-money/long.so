import { Badge } from "@/components/ui/badge";
import SPNTest from "@/assets/icons/spn-test.svg";
import ArrowDown from "@/assets/icons/arrow-down.svg";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export const NetworkSelection = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="group">
        <Badge
          variant="invert"
          className={
            "hidden w-28 rounded-2xl px-0.5 transition-[width] group-hover:w-[120px] group-data-[state=open]:w-[120px] group-data-[state=open]:rounded-b-none group-data-[state=open]:border-b-0 md:inline-flex"
          }
        >
          <div className="flex-col">
            <div className="flex flex-row items-center">
              <div className="mr-2">
                <SPNTest className="size-[30px]" />
              </div>
              <div className="text-nowrap">SPN-Test</div>
              <div className="ml-2 hidden w-0 transition-[width] group-hover:inline-flex group-hover:w-2 group-data-[state=open]:inline-flex group-data-[state=open]:w-2">
                <ArrowDown width={10} height={6} />
              </div>
            </div>
          </div>
        </Badge>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="relative flex w-[120px] flex-col gap-1 rounded-2xl rounded-t-none border border-t-0 border-black bg-white p-2 ">
          <DropdownMenu.Item className="cursor-pointer p-1 text-xs">
            Ethereum
          </DropdownMenu.Item>
          <DropdownMenu.Item className="cursor-pointer p-1 text-xs">
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
