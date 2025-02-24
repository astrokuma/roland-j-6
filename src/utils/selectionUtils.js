export const getSelectionNumber = (uniqueId, selectionOrder) => {
  const index = selectionOrder.indexOf(uniqueId);
  return index !== -1 ? index + 1 : null;
};
