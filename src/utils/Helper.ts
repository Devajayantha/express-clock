export default class Helper {
  static getSecondsUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set time to midnight (00:00:00) of the next day

    const differenceInMilliseconds = midnight.getTime() - now.getTime();
    const differenceInSeconds = differenceInMilliseconds / 1000; // Convert to seconds

    return Math.floor(differenceInSeconds);
  }

  static formatDateForId(date: Date): string {
    // ISO string: "2025-05-15T09:04:28.000Z"
    // Take just the date part and remove dashes
    return date.toISOString().slice(0, 10).replace(/-/g, '');
  }

  static getFirstDateOfMonth(date: Date = new Date()) {
    // Get the first date of the current month
    const firstDateOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    firstDateOfMonth.setHours(0, 0, 0, 0);  // Set time to 00:00:00

    return firstDateOfMonth;
  }

  static getLastDateOfMonth(date: Date = new Date()) {
    // Get the last date of the current month
    const lastDateOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    lastDateOfMonth.setHours(23, 59, 59, 999);  // Set time to 23:59:59.999

    return lastDateOfMonth;
  }
}