import { Badge } from "@/components/ui/badge";
import { DurationSegmentedControl } from "@/components/DurationSegmentedControl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactECharts from "echarts-for-react";
import { traderRewardsData } from "@/components/InventoryContent/data/traderRewardsData";
import { format } from "date-fns";
import { TransactionHistoryTable } from "@/app/_TransactionHistoryTable/TransactionHistoryTable";
import { columns } from "@/app/_TransactionHistoryTable/columns";
import { transactionHistoryData } from "@/components/InventoryContent/data/transactionHistoryData";

export const TradeTabContent = () => {
  return (
    <div className="mt-[34px] flex flex-col items-center ">
      <div className={"text-[14px] font-medium "}>My Total Trade Rewards</div>

      <Badge
        variant={"iridescent"}
        className={"mt-[12px] text-[30px] font-medium"}
      >
        $1,337
      </Badge>

      <div className="mt-[19px] w-[223px] text-center text-[10px] font-normal text-neutral-400 md:mt-[28px]">
        Earn more by making more transactions!
      </div>

      <div className="mt-[42px] flex w-full flex-row items-center justify-between">
        <div className="text-[10px] font-medium">Trader Rewards Over Time</div>
        <DurationSegmentedControl
          variant={"secondary"}
          className={"hidden text-[10px] md:flex"}
        />
        <Select>
          <SelectTrigger className="w-[90px] border-0 bg-transparent text-right text-[10px] md:hidden">
            <SelectValue defaultValue={"7D"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7D">7 Days</SelectItem>
            <SelectItem value="1M">1 Month</SelectItem>
            <SelectItem value="6M">6 Months</SelectItem>
            <SelectItem value="1Y">1 Year</SelectItem>
            <SelectItem value="ALL">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ReactECharts
        className="mt-[10px] h-[70px] w-full  md:mt-[20px]"
        opts={{
          height: 70,
        }}
        style={{
          height: 70,
        }}
        option={{
          grid: {
            left: "0", // or a small value like '10px'
            right: "0", // or a small value
            top: "0", // or a small value
            bottom: "0", // or a small value
          },
          tooltip: {
            trigger: "axis", // Trigger tooltip on axis movement
            axisPointer: {
              type: "cross", // Display crosshair style pointers
            },
            borderWidth: 0,
            backgroundColor: "#EBEBEB",
            textStyle: {
              color: "#1E1E1E",
            },
            formatter:
              "<div class='flex flex-col items-center'>${c} <div class='text-gray-2 text-center w-full'>{b}</div></div>",
          },
          xAxis: {
            type: "category",
            data: traderRewardsData.map((d) => format(d.date, "P")),
            show: false,
            axisPointer: {
              label: {
                show: false,
              },
            },
          },
          yAxis: {
            type: "value",
            show: false,
            axisPointer: {
              label: {
                show: false,
              },
            },
          },
          series: [
            {
              type: "bar",
              data: traderRewardsData.map((d) => d.uv),
              itemStyle: {
                color: "#EBEBEB",
              },
              barWidth: "70%", // Adjust bar width (can be in pixels e.g., '20px')
              barGap: "30%", // Adjust the gap between bars in different series
            },
          ],
        }}
      />

      <div className={"mt-[13px] w-full text-left text-[10px]"}>
        22nd February 2024
      </div>

      <div className="mt-[30px] w-full text-left text-[10px]">
        My Transaction History
      </div>

      <TransactionHistoryTable
        columns={columns}
        data={transactionHistoryData}
      />
    </div>
  );
};
