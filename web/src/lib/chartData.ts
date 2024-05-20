
import { MIN_TICK, POSSIBLE_TICKS } from "./math";

import { subDays } from "date-fns";

export const createChartData = (liquidityGraph: bigint[]) => {
  // Create the chart, by taking a chart of all the available liquidity
  // per tick organised by 5000 at a time, assume it's sorted, and that
  // it's the maximum we can show.
  // TODO: MOCKED
  const amountOfTicks = Math.floor(POSSIBLE_TICKS / 5000);
  let liqPos = 0;
  const today = new Date();
  return Array(amountOfTicks).fill(undefined).map((_, i) => {
    const tick = i + MIN_TICK;
    return {
      name: `Tick ${tick}`,
      date: today,
      uv: 4000,
      pv: 2400,
      amt: 2400,
    }
  });
};
