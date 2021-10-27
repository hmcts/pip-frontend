import config from 'config';
import * as propertiesVolume from '@hmcts/properties-volume';
import { Application } from 'express';
import { get, set } from 'lodash';

export class PropertiesVolume {

  enableFor(server: Application): void {
    if (server.locals.ENV !== 'development') {
      propertiesVolume.addTo(config, {mountPoint: process.env.SECRETS_DIRECTORY});

      console.log(config);
      console.log(config['pip-shared-kv']);
      console.log(Object.keys(config));

      this.setSecret('secrets.Publishing-information-project.AppInsightsInstrumentationKey', 'appInsights.instrumentationKey');
    }
  }

  private setSecret(fromPath: string, toPath: string): void {
    if (config.has(fromPath)) {
      set(config, toPath, get(config, fromPath));
    }
  }

}
