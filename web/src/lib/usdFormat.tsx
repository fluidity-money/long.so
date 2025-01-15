// Format a positive value into a USD string, truncating with a letter for millions and higher
export const usdFormat = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value < 1000000 ? "standard" : "compact",
    minimumFractionDigits: 2,
    // For tiny values, we should display the entire thing without rounding.
    // 20 is the maximum number of digits supported by Intl.NumberFormat in our Node version.
    maximumFractionDigits: value < 0.01 ? 20 : undefined,
  }).format(value);
};
