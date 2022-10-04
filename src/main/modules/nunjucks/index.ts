import * as path from 'path';
import * as express from 'express';
import * as nunjucks from 'nunjucks';
import moment from 'moment/moment';
import { PublicationService } from '../../service/publicationService';

const publicationService = new PublicationService();

export class Nunjucks {
  constructor(public developmentMode: boolean) {
    this.developmentMode = developmentMode;
  }

  enableFor(app: express.Express): void {
    app.set('view engine', 'njk');
    const govUkFrontendPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'node_modules',
      'govuk-frontend',
    );
    const mojFrontendPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'node_modules',
      '@ministryofjustice',
      'frontend',
    );
    const env = nunjucks.configure(
      [path.join(__dirname, '..', '..', 'views'), govUkFrontendPath, mojFrontendPath],
      {
        autoescape: true,
        watch: this.developmentMode,
        express: app,
      },
    );

    const dateFilter = require('nunjucks-date-filter');
    env.addFilter('date', dateFilter);
    const fs = require ('fs');
    const listTypes = publicationService.getListTypes();
    const languageLookup = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'languageLookup.json')));
    // to get the pretty list type name
    env.addFilter('listType', function(x){return listTypes.get(x)?.friendlyName;});
    // to get the list type url
    env.addFilter('listUrl', function(x){return listTypes.get(x)?.url;});
    // to return the prettier language name
    env.addFilter('language', function(x){return languageLookup[x];});
    // to switch a string to titleCase (and remove extraneous underline in bilingual header)
    env.addFilter('titleCase', function(x){return (x == 'BI_LINGUAL' ? 'Bilingual' : x.charAt(0).toUpperCase() + x.slice(1).toLowerCase());});
    // for calculating date ranges
    env.addFilter('dateRange', function(x){return moment(x.displayFrom).format('D MMM YYYY') +
      ' to ' + moment(x.displayTo).format('D MMM YYYY');});
    // for govuk links
    env.addFilter('emailLink', function(x){ return this.env.filters.safe('<a class=govuk-link href="mailto:' + x + '">'+ x +'</a>');});
    // for phone numbers to display as links
    env.addFilter('phoneLink', function(x){return this.env.filters.safe('<a class=govuk-link href="tel:' + x + '">' + x + '</a>');});

    app.use((req, res, next) => {
      res.locals.pagePath = req.path;
      res.locals.lng = req['lng'];
      next();
    });
  }
}
