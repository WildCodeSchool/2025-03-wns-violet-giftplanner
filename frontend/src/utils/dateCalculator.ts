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

export function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/**
 *
 * @param date date ou strigne a convertir en date
 * @returns une date forcément au format Date, même si c'est une string
 */
export function dateOrStringToDate(date: Date | string): Date {
  return typeof date === "string" ? new Date(date) : date;
}

/**
 * return true si les 2 dates sont le même jour (même année, même mois, même jour) mais pas forcément la même heure
 * @param date1
 * @param date2
 * @returns
 */
export function isSameDate(date1: Date | string, date2: Date | string): boolean {
  date1 = dateOrStringToDate(date1);
  date2 = dateOrStringToDate(date2);

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
