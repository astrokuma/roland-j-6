export const getSelectionNumber = (num, selectionOrder) => {
  const index = selectionOrder.indexOf(num);
  return index !== -1 ? (index < 12 ? index + 1 : null) : null;
};
