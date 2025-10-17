export const getCurrentMonthYear = () => {
  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const year = now.getUTCFullYear();
  return `${month}-${year}`;
};

export const isLastDayOfMonth = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);
  return tomorrow.getUTCMonth() !== today.getUTCMonth();
};

export const getMonthStartEnd = () => {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
  return { start, end };
};