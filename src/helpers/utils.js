export const DECIMALS = (10**18);

export const ether = wei => wei / DECIMALS;

export const formatPrice = (price) => {
  const precision = 100; // Use 2 decimal places

  price = ether(price);
  price = Math.round(price * precision) / precision;
   
  return price;
};