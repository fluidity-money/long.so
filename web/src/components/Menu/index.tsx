import { LayoutGroup, motion } from "framer-motion";
import ArrowDown from "@/assets/icons/arrow-down.svg";
import ProToggle from "@/assets/icons/pro-toggle.svg";
import ProToggleSelected from "@/assets/icons/pro-toggle-selected.svg";
import { cn } from "@/lib/utils";
import { clsx } from "clsx";
import { useWelcomeStore } from "@/stores/useWelcomeStore";
import { usePathname, useRouter } from "next/navigation";
import config from "@/config";

interface ItemProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  groupId?: string;
  background?: "light" | "dark";
  proToggle?: boolean;
  className?: string;
  variant?: "iridescent";
}

/**
 * Menu item component
 *
 * @deprecated Use `SegmentedControl` instead
 */
const Item: React.FC<ItemProps> = ({
  children,
  selected,
  onClick,
  groupId,
  background = "light",
  proToggle,
  className,
  variant,
}) => {
  const pathname = usePathname();
  const isPro = pathname.startsWith("/pro");
  const { setWelcome } = useWelcomeStore();
  const router = useRouter();
  return (
    <motion.div
      className={cn(
        "group relative z-1 rounded-md",
        selected && "box-content",
        background === "dark"
          ? "bg-[#EBEBEB] text-[#1E1E1E]"
          : "bg-[#1E1E1E] text-[#EBEBEB]",
        proToggle &&
          `h-6 px-3 transition-[width] ${isPro ? "md:w-[110px] md:hover:w-[130px]" : "md:w-[70px] md:hover:w-[100px]"}`,
        selected ? "cursor-default" : "cursor-pointer",
        className,
      )}
      whileTap={{
        scale: !selected ? 0.95 : 1,
        y: 1,
        transition: {
          duration: 0.2,
          ease: "easeInOut",
        },
      }}
      onClick={onClick}
    >
      {selected && (
        <>
          <motion.div
            layoutId={groupId}
            // background={background}
            className={cn(
              "absolute inset-0 -z-10 rounded-md",
              background === "light" ? "bg-black" : "bg-white",
              proToggle && isPro && "shine",
              {
                iridescent: variant === "iridescent",
              },
            )}
          />
        </>
      )}
      <div
        className={cn(
          "flex h-full flex-row items-center justify-center gap-2 text-base font-medium",
          {
            "iridescent-text": variant === "iridescent" && !selected,
            "text-black": variant === "iridescent" && selected,
          },
        )}
      >
        {children}
        {proToggle && (
          <div
            id="swap-pro-toggle"
            className="hidden items-center justify-center md:flex"
          >
            <div className="group-hover:hidden">
              <ArrowDown className={cn(selected && "text-white", "size-2")} />
            </div>
            <div
              className={clsx(`hidden cursor-pointer group-hover:inline-flex`, {
                invert: !selected,
              })}
              onClick={() => {
                setWelcome(false);
                router.push(isPro ? "/" : `/pro/${config.pools[0].address}`);
              }}
            >
              {isPro ? (
                <ProToggleSelected className="my-0.5 h-[15px] w-auto" />
              ) : (
                <ProToggle className="my-0.5 h-[15px] w-auto" />
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface MenuProps {
  children: React.ReactElement<ItemProps>[];
  background?: "light" | "dark";
  style?: "primary" | "secondary";
  id: string;
  className?: string;
}

/**
 * Menu component
 *
 * @deprecated Use `SegmentedControl` instead
 */
const Menu: React.FC<MenuProps> = ({
  children,
  background = "light",
  style = "secondary",
  id,
  className,
}) => {
  const frameColor =
    (background === "light" && style === "primary") ||
    (background === "dark" && style === "secondary")
      ? "dark"
      : "light";

  return (
    <div className={cn("flex flex-row gap-3 rounded select-none", className)}>
      <LayoutGroup id={id}>
        {children.map((item, i) => {
          return (
            <Item
              {...item.props}
              groupId={id}
              key={`${id}-${i}`}
              background={frameColor}
            />
          );
        })}
      </LayoutGroup>
    </div>
  );
};

export default Object.assign(Menu, {
  Item,
});
