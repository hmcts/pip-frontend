import {LanguageFileParser} from './languageFileParser';
import {DateTime} from 'luxon';

const ONE = 1;
const languageFileParser = new LanguageFileParser();
const timeZone = 'Europe/London';

export const formatDuration = (days: number, hours: number, minutes: number, language: string, languageFile: string): string => {
  if (days > 0) {
    return formatDurationTime(days, 'hearingDurationDay', language, languageFile);
  } else if (hours > 0 && minutes > 0) {
    return formatDurationTime(hours, 'hearingDurationHour', language, languageFile)
      + ' ' + formatDurationTime(minutes, 'hearingDurationMinute', language, languageFile);
  } else if (hours > 0 && minutes == 0) {
    return formatDurationTime(hours, 'hearingDurationHour', language, languageFile);
  } else if (hours == 0 && minutes > 0) {
    return formatDurationTime(minutes, 'hearingDurationMinute', language, languageFile);
  }
  return '';
};

const formatDurationTime = (duration: number, format: string, language: string, languageFile: string): string => {
  const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
  if(duration > ONE) {
    format = format + 's';
  }
  return duration + ' ' + languageFileParser.getText(fileJson, null, format);
};

export const formatDate = (dateTime: string, format: string): string => {
  if(/\S/.test(dateTime) && dateTime !== null) {
    const formattedDate = DateTime.fromISO(dateTime, {zone: timeZone}).toFormat(format);
    return format === 'h:mma' ? formattedDate.toLowerCase() : formattedDate;
  }
};

