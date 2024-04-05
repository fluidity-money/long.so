import { subDays } from "date-fns";

// {
//   name: "Page A",
//     date: new Date(),
//   uv: 4000,
//   pv: 2400,
//   amt: 2400,
// },

export const getYieldOverTimeData = (length: number) => {
  const data = [];
  for (let i = 0; i < length; i++) {
    data.push({
      date: subDays(new Date(), length - i),
      uv: Math.floor(Math.random() * 1000),
      pv: Math.floor(Math.random() * 1000),
    });
  }
  return data;
};
