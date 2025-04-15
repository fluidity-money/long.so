"use client";

import Menu from "@/components/Menu";
import { usePathname, useRouter } from "next/navigation";

/**
 * The main Swap/Stake navigation menu.
 */
export const NavigationMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isPro = pathname.startsWith("/pro");
  return (
    <Menu id="nav">
      <Menu.Item
        // onClick={() => {
        //   router.push("/");
        // }}
        selected={
          pathname === "/" ||
          pathname.startsWith("/swap") ||
          pathname.startsWith("/pro")
        }
        proToggle
      >
        <div className="text-nowrap">
          Swap {isPro && <div className="hidden md:inline-flex">{" Pro"}</div>}
        </div>
      </Menu.Item>
      <Menu.Item
        className={"w-[73px]"}
        onClick={() => {
          router.push("/stake");
        }}
        selected={pathname.startsWith("/stake")}
      >
        <span className={"dark:text-white"}>Stake</span>
      </Menu.Item>
    </Menu>
  );
};
