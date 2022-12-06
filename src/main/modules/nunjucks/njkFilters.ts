import path from 'path';
import moment from 'moment';
import { PublicationService } from '../../service/publicationService';
import { printableDuration } from './printableDuration';
const publicationService = new PublicationService();

function createFilters (env) {
  const dateFilter = require('nunjucks-date-filter');
  env.addFilter('date', dateFilter);
  const fs = require('fs');
  const listTypes = publicationService.getListTypes();
  const languageLookup = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'languageLookup.json')));
  // to get the pretty list type name
  env.addFilter('listType', function(x) {
    return listTypes.get(x)?.friendlyName;
  });
  // to get the list type url
  env.addFilter('listUrl', function(x) {
    return listTypes.get(x)?.url;
  });
  // to return the prettier language name
  env.addFilter('language', function(x) {
    return languageLookup[x];
  });
  // to switch a string to titleCase (and remove extraneous underline in bilingual header)
  env.addFilter('titleCase', function(x) {
    return (x == 'BI_LINGUAL' ? 'Bilingual' : x.charAt(0).toUpperCase() + x.slice(1).toLowerCase());
  });
  // for calculating date ranges
  env.addFilter('dateRange', function(x) {
    return moment(x.displayFrom).format('D MMM YYYY') +
      ' to ' + moment(x.displayTo).format('D MMM YYYY');
  });
  // for emails to appear as govuk links
  env.addFilter('emailLink', function(x) {
    return this.env.filters.safe('<a class=govuk-link href="mailto:' + x + '">' + x + '</a>');
  });
  // for phone numbers to display as links
  env.addFilter('phoneLink', function(x) {
    return this.env.filters.safe('<a class=govuk-link href="tel:' + x + '">' + x + '</a>');
  });
  // to transform duration in hours/mins into a multilingual single value.
  env.addFilter('getDuration', function(hours, mins, language) {
    return [printableDuration(hours, 'hour', language), printableDuration(mins, 'min', language)].join(' ').trim();
  });
}
module.exports = createFilters;
