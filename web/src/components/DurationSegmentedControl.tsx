import { useRef } from "react";
import SegmentedControl, {
  SegmentedControlProps,
} from "@/components/ui/segmented-control";

export const DurationSegmentedControl = ({
  className,
  variant,
}: {
  className?: string;
  variant?: SegmentedControlProps<string>["variant"];
}) => {
  return (
    <SegmentedControl
      name={"duration"}
      className={className}
      variant={variant}
      segments={[
        {
          label: "7D",
          value: "7D",
          ref: useRef(),
        },
        {
          label: "1M",
          value: "1M",
          ref: useRef(),
        },
        {
          label: "6M",
          value: "6M",
          ref: useRef(),
        },
        {
          label: "1Y",
          value: "1Y",
          ref: useRef(),
        },
        {
          label: "ALL",
          value: "ALL",
          ref: useRef(),
        },
      ]}
    />
  );
};
