import path from 'path';
import { DateTime } from 'luxon';
import { PublicationService } from '../../service/publicationService';
import { printableDuration } from './printableDuration';
import { calculateDurationSortValue } from '../../helpers/dateTimeHelper';

const publicationService = new PublicationService();

function createFilters(env) {
    const dateFilter = require('nunjucks-date-filter');
    env.addFilter('date', dateFilter);
    const fs = require('fs');
    const listTypes = publicationService.getListTypes();
    const languageLookup = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'languageLookup.json')));
    // to get the pretty list type name
    env.addFilter('listType', function (x) {
        return listTypes.get(x)?.friendlyName;
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

    // for emails to appear as govuk links
    env.addFilter('emailLink', function (x) {
        return this.env.filters.safe('<a class=govuk-link href="mailto:' + x + '">' + x + '</a>');
    });

    // for phone numbers to display as links
    env.addFilter('phoneLink', function (x) {
        return this.env.filters.safe('<a class=govuk-link href="tel:' + x + '">' + x + '</a>');
    });

    // to transform duration in hours/mins into a multilingual single value.
    env.addFilter('getDuration', function (hours, mins, language) {
        return [printableDuration(hours, 'hour', language), printableDuration(mins, 'min', language)].join(' ').trim();
    });

    // to convert the date string (in format DD/MM/YYYY) to a number value for sorting
    env.addFilter('dateToSortValue', function (date) {
        return date.split('/').reverse().join('');
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
}

module.exports = createFilters;
