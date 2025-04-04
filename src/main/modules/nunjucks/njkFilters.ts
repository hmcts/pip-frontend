import { DateTime } from 'luxon';
import { PublicationService } from '../../service/PublicationService';
import { printableDuration } from './printableDuration';
import { calculateDurationSortValue } from '../../helpers/dateTimeHelper';
import { runtime } from 'nunjucks';
import rejectReasonLookupFile from '../../resources/media-account-rejection-reasons-lookup.json';
import languageLookupFile from './languageLookup.json';
import dateFilter from 'nunjucks-date-filter';

const publicationService = new PublicationService();

export function createFilters(env) {
    env.addFilter('date', dateFilter);
    const listTypes = publicationService.getListTypes();
    const languageLookup = languageLookupFile;
    const rejectReasonLookup = rejectReasonLookupFile;

    // takes array or comma-separated string of rejection reason codes, transforms to an ordered list
    // with optional padding depending on where it's being displayed.
    env.addFilter('mediaRejectionClean', (csvList, nopadding = false) => {
        csvList = Array.isArray(csvList) ? csvList : csvList.split(',');
        const listItems = csvList
            .map(x => rejectReasonLookup[x] ?? x)
            .map(x => linkify(`<li><b>${x[0]}</b><br>${x[1]} </li>`))
            .join('');
        return new runtime.SafeString(`<ol${nopadding ? ' class="govuk-!-padding-left-4"' : ''}>${listItems}</ol>`);
    });

    // takes in a string and hunts for a url. If it finds one, it wraps it with link tags
    // Note: Output from this will need to be used in a "safestring" to render properly.
    function linkify(inputString) {
        const urlRegex = /(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
        // target is blank to open in new tab
        return inputString.replace(
            urlRegex,
            '<a href="$1" class="govuk-link" target="_blank" rel="noopener noreferrer">$1 </a>(opens in a new window)'
        );
    }

    // to get the pretty list type name
    env.addFilter('listType', function (listType, language) {
        const listLookupValue = listTypes.get(listType);
        if (listLookupValue) {
            if (language == 'cy') {
                return listLookupValue?.['isWeeklyList']
                    ? listLookupValue.welshFriendlyName + ' ar gyfer yr wythnos yn dechrau ar'
                    : listLookupValue.welshFriendlyName;
            } else {
                return listLookupValue?.['isWeeklyList']
                    ? listLookupValue.friendlyName + ' for week commencing'
                    : listLookupValue.friendlyName;
            }
        }
        return '';
    });

    // to get the list type url
    env.addFilter('listUrl', function (x) {
        return listTypes.get(x)?.url;
    });

    // to return the prettier language name
    env.addFilter('language', function (x) {
        return languageLookup[x];
    });

    // to switch a string to titleCase (and remove extraneous underline in bilingual header)
    env.addFilter('titleCase', function (x) {
        return x == 'BI_LINGUAL' ? 'Bilingual' : x.charAt(0).toUpperCase() + x.slice(1).toLowerCase();
    });

    // for calculating date ranges
    env.addFilter('dateRange', function (x) {
        return (
            DateTime.fromISO(x.displayFrom, { zone: 'Europe/London' }).toFormat('dd MMM yyyy') +
            ' to ' +
            DateTime.fromISO(x.displayTo, { zone: 'Europe/London' }).toFormat('dd MMM yyyy')
        );
    });

    // to transform duration in hours/mins into a multilingual single value.
    env.addFilter('getDuration', function (hours, mins, language) {
        return [printableDuration(hours, 'hour', language), printableDuration(mins, 'min', language)].join(' ').trim();
    });

    // to convert the date string (in format DD/MM/YYYY) to a number value for sorting
    env.addFilter('dateToSortValue', function (date) {
        return date.split('/').reverse().join('');
    });

    // to convert the date string (in format D MMM YYYY) to a number value for sorting
    env.addFilter('dateWithShortMonthNameToSortValue', function (date) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const values = date.split(' ');
        const month = (months.indexOf(values[1]) + 1).toString();
        return values[2] + month.padStart(2, '0') + values[0].padStart(2, '0');
    });

    // to convert the day and month name string (in format DD MMMM) to a number value for sorting
    env.addFilter('dayMonthNameToSortValue', function (date) {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const values = date.split(' ');
        return months.indexOf(values[1]) + 1 + values[0];
    });

    // To convert time in 12 hours format (ha or h:mma format) to a number value for sorting
    env.addFilter('timeToSortValue', function (time) {
        const timePart = time.slice(0, time.length - 2);
        const modifier = time.slice(time.length - 2);
        let [hours, minutes] = timePart.split(':');

        if (hours === '12') {
            hours = '0';
        }
        if (minutes === undefined) {
            minutes = '00';
        }
        if (modifier === 'pm') {
            hours = parseInt(hours, 10) + 12;
        }
        return parseInt(hours + minutes, 10);
    });

    env.addFilter('durationToSortValue', function (hours, minutes) {
        return calculateDurationSortValue(0, hours, minutes);
    });

    env.addFilter('addRepresentativeToParty', function (party, representative, representativeKeyword) {
        let result = party;
        if (representative) {
            if (party) {
                result += ', ' + representativeKeyword + ': ' + representative;
            } else {
                result = representativeKeyword + ': ' + representative;
            }
        }
        return result;
    });

    env.addFilter('convertDataSourceName', function (provenance, language) {
        if (provenance == 'SNL') {
            return 'ListAssist';
        } else if (provenance == 'MANUAL_UPLOAD' && language == 'cy') {
            return 'Lanlwytho â Llaw';
        }
        return provenance.replaceAll('_', ' ').replace(/\w\S*/g, function (word) {
            return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
        });
    });

    env.addFilter('appendCaseSequenceIndicator', function (data, caseSequenceIndicator) {
        if (caseSequenceIndicator) {
            const caseSequenceWithBrackets = '[' + caseSequenceIndicator + ']';
            return data ? data + ' ' + caseSequenceWithBrackets : caseSequenceWithBrackets;
        } else {
            return data;
        }
    });

    env.addFilter('dateFormatter', function (date, language) {
        return DateTime.fromFormat(date, 'dd/M/yyyy', { zone: 'utc' }).setLocale(language).toFormat('d MMMM yyyy');
    });

    env.addFilter('timeFormatter', function (time) {
        return time ? time.replace('.', ':') : null;
    });
}
