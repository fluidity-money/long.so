import { LayoutGroup, motion } from "framer-motion";
import styles from "./Menu.module.scss";
import { Box } from "../index";
import ArrowDownWhite from "@/assets/icons/arrow-down-white.svg";
import ArrowDown from "@/assets/icons/arrow-down.svg";
import ProToggle from "@/assets/icons/pro-toggle.svg";
import ProToggleSelected from "@/assets/icons/pro-toggle-selected.svg";
import { useSwapPro } from "@/stores/useSwapPro";
import { cn } from "@/lib/utils";
import { clsx } from "clsx";
import { useWelcomeStore } from "@/stores/useWelcomeStore";

interface ItemProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  groupId?: string;
  background?: "light" | "dark";
  proToggle?: boolean;
  className?: string;
}

const Item: React.FC<ItemProps> = ({
  children,
  selected,
  onClick,
  groupId,
  background = "light",
  proToggle,
  className,
}) => {
  const classes = `
    ${styles.Item}
    ${selected ? styles.selected : ""}
    ${styles[background]}
  `;

  const { swapPro, setSwapPro } = useSwapPro();
  const { setWelcome } = useWelcomeStore();

  return (
    <motion.div
      className={cn(
        classes,
        "group rounded-md px-4 py-3 text-sm font-medium",
        proToggle &&
          `w-16 transition-[width]  ${swapPro ? "md:w-28 md:hover:w-36" : "md:w-20 md:hover:w-28"}`,
        !selected && "cursor-pointer",
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
          <Box
            layoutId={groupId}
            background={background}
            className={`${styles.virtualBox} ${proToggle && swapPro ? "shine" : ""}`}
          />
        </>
      )}
      <div className={"flex flex-row items-center gap-2"}>
        {children}
        {proToggle && (
          <div className="hidden md:inline-flex">
            <div className="group-hover:hidden">
              {selected ? (
                <ArrowDownWhite height={10} width={10} />
              ) : (
                <ArrowDown height={10} width={10} />
              )}
            </div>
            <div
              className={clsx(`hidden cursor-pointer group-hover:inline-flex`, {
                invert: !selected,
              })}
              onClick={() => {
                setWelcome(false);
                setSwapPro(!swapPro);
              }}
            >
              {swapPro ? (
                <ProToggleSelected className="h-[20px] w-[35px]" />
              ) : (
                <ProToggle className="h-[20px] w-[35px]" />
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
}

const Menu: React.FC<MenuProps> = ({
  children,
  background = "light",
  style = "secondary",
  id,
}) => {
  const frameColor =
    (background === "light" && style === "primary") ||
    (background === "dark" && style === "secondary")
      ? "dark"
      : "light";

  return (
    <div className="flex flex-row gap-1 rounded p-1">
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
