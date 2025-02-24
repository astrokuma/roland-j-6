export const cycleIndex = (current, length, step = 1) => {
  return (current + step + length) % length;
};
