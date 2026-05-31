import type { Fill } from "@repo/common/engineTypes";

export function calculateAveragePrice(fills: Fill[]) {
  let sum = 0;
  fills.forEach((fill) => sum += fill.price);
  const averagePrice = sum / fills.length;
  return averagePrice;
}

export function calculateTotalFilledQty(fills: Fill[]) {
  let filledQty = 0;
  fills.forEach((fill) => filledQty += fill.qty);
  return filledQty;
}
