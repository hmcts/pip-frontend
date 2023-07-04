import { DateTime } from 'luxon';

export function padFormatted(value) {
    return value.toString().padStart(2, '0');
}

export function getCurrentDateWthFormat(format = 'dd/MM/yyyy'): string {
    return DateTime.now().setLocale('gb').toFormat(format);
}

export function getDateNowAndFuture(): [Date, Date] {
    const date = new Date();
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 1);
    return [date, dayAfter];
}
