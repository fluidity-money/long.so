// Format a positive value into a USD string, truncating with a letter for millions and higher.
// For non-price values that are too small, don't display the whole number
export const usdFormat = (value: number, isPrice = false) => {
  const belowMinimum = value < 0.01;
  if (belowMinimum && !isPrice) {
    return "<$0.01";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value < 1000000 ? "standard" : "compact",
    minimumFractionDigits: 2,
    // For tiny values, we should display the entire thing without rounding.
    // 20 is the maximum number of digits supported by Intl.NumberFormat in our Node version.
    maximumFractionDigits: belowMinimum ? 20 : undefined,
  }).format(value);
};
