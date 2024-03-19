import { usdFormat } from "@/lib/usdFormat";
import { format } from "date-fns";

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col items-center rounded-lg bg-black p-2 text-white">
        <p className="text-sm">{usdFormat(payload[0].value as number)}</p>
        <p className="text-xs text-gray-2">
          {format(payload[0].payload.date, "P")}
        </p>
      </div>
    );
  }

  return null;
};
