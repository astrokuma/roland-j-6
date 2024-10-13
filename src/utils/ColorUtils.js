// colorUtils.js

const colors = ["bg-red-500", "bg-red-200", "bg-orange-500", "bg-orange-200", "bg-yellow-500", "bg-lime-500", "bg-lime-200", "bg-violet-500", "bg-violet-200", "bg-fuchsia-500", "bg-fuchsia-200", "bg-pink-500"];

export const getColorByIndex = (index) => {
  return colors[index % colors.length]; // Use modulus to wrap around
};
