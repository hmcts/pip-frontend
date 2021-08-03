import { Application } from 'express';
import {infoRequestHandler} from '@hmcts/info-provider';
import os from 'os';

export default function(app: Application): void {

  app.get('/', app.locals.container.cradle.homeController.get);
  app.get('/search-option', app.locals.container.cradle.searchOptionController.get);
  app.get('/court-list', app.locals.container.cradle.courtListController.get)
  app.get('/not-found', app.locals.container.cradle.notFoundPageController.get);
  app.get('/info', infoRequestHandler({
    extraBuildInfo: {
      host: os.hostname(),
      name: 'expressjs-template',
      uptime: process.uptime(),
    },
    info: {
      // TODO: add downstream info endpoints if your app has any
    },
  }));

}
