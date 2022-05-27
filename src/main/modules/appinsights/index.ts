import config from 'config';

const appInsights = require('applicationinsights');

export class AppInsights {

  enable(): void {
    if (config.get('secrets.pip-ss-kv.INSTRUMENTATION_KEY')) {
      appInsights.setup(config.get('secrets.pip-ss-kv.INSTRUMENTATION_KEY'))
        .setSendLiveMetrics(true)
        .start();

      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'pip-frontend';
      appInsights.defaultClient.trackTrace({message: 'App insights activated'});
    }
  }

}
