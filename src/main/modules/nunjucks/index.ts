import * as path from 'path';
import * as express from 'express';
import * as nunjucks from 'nunjucks';

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
    const listTypeLookup = new Map([
      ['SJP_PUBLIC_LIST', 'Single Justice Procedure Public List'],
      ['SJP_PRESS_LIST', 'Single Justice Procedure Press List'],
      ['CROWN_DAILY_LIST', 'Crown Daily List'],
      ['CROWN_WARNED_LIST', 'Crown Warned List'],
      ['CROWN_FIRM_LIST', 'Crown Firm List'],
      ['MAGS_PUBLIC_LIST', 'Magistrate Public List'],
      ['MAGS_STANDARD_LIST', 'Magistrate Standard List'],
      ['CIVIL_DAILY_CAUSE_LIST', 'Civil Daily Cause List'],
      ['FAMILY_DAILY_CAUSE_LIST', 'Family Daily Cause List'],
    ]);
    env.addFilter('listType', function(x){return listTypeLookup.get(x);});

    app.use((req, res, next) => {
      res.locals.pagePath = req.path;
      next();
    });
  }
}
