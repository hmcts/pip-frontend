import  luxon from 'luxon';

const timeZone = 'Europe/London';

export class luxonHelper {
  public convertToUtc(datetime: string): any {
    const DateTime = luxon.DateTime;
    return DateTime.fromISO(datetime, {zone: timeZone}).toUTC();
  }
}
