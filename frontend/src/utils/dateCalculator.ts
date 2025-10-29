export function countdownDate(date: Date) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const lastDay = date instanceof Date ? new Date(date.getTime()) : new Date(date);
  const today = new Date();

  // compare whole days by setting local midnight
  lastDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // use getTime() so subtraction is between numbers (milliseconds)
  const diffMs = lastDay.getTime() - today.getTime();
  return Math.round(diffMs / MS_PER_DAY);
}
