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
    env.addFilter('listType', function(x){return listTypes.get(x)?.friendlyName;});
    env.addFilter('listUrl', function(x){return listTypes.get(x)?.url;});
    env.addFilter('language', function(x){return languageLookup[x];});
    env.addFilter('titleCase', function(x){return (x == 'BI_LINGUAL' ? 'Bilingual' : x.charAt(0).toUpperCase() + x.slice(1).toLowerCase());});
    env.addFilter('dateRange', function(x){return moment(x.displayFrom).format('D MMM YYYY') +
      ' to ' + moment(x.displayTo).format('D MMM YYYY');});

    app.use((req, res, next) => {
      res.locals.pagePath = req.path;
      next();
    });
  }
}
