export default class Helper {
  static getSecondsUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set time to midnight (00:00:00) of the next day

    const differenceInMilliseconds = midnight.getTime() - now.getTime();
    const differenceInSeconds = differenceInMilliseconds / 1000; // Convert to seconds

    return Math.floor(differenceInSeconds);
  }
}