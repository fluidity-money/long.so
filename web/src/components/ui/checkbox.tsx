import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { Input } from "./input";
import { cva, VariantProps } from "class-variance-authority";

const checkboxVariants = cva(
  cn(
    "w-[1.25em] h-[1.25em] p-0 appearance-none border-0 cursor-pointer relative rounded-sm",
    // this is a weird hack to show the tick using border edges, but it would be better to display an icon
    "checked:before:content-[''] checked:before:absolute checked:before:top-1/2 checked:before:left-1/2 checked:before:w-[10px] checked:before:h-[6px] checked:before:border-l-2 checked:before:border-b-2 checked:before:border-black checked:before:transform checked:before:-translate-x-1/2 checked:before:-translate-y-2/3 checked:before:rotate-[-45deg]",
  ),
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof checkboxVariants> {
  enabled: boolean;
}

interface CheckboxContainerProps extends CheckboxProps {
  setChecked: Dispatch<SetStateAction<boolean>>;
}

const CheckboxContainer = ({
  enabled,
  checked,
  setChecked,
  children,
  ...props
}: CheckboxContainerProps) => (
  <div
    onClick={() => enabled && setChecked(!checked)}
    className={cn(
      "mt-[10px]",
      "justify-left flex cursor-pointer select-none flex-row items-end gap-1 text-xs font-bold underline",
      !enabled && "cursor-not-allowed text-gray-2",
    )}
  >
    <Checkbox enabled={enabled} checked={checked} {...props} />
    {children}
  </div>
);

const Checkbox = ({
  enabled,
  checked,
  variant,
  className,
  ...props
}: CheckboxProps) => (
  <Input
    className={cn(
      checked && "iridescent",
      checkboxVariants({ variant, className }),
    )}
    autoFocus
    disabled={!enabled}
    checked={checked}
    type="checkbox"
    {...props}
  />
);

export { Checkbox, CheckboxContainer };
