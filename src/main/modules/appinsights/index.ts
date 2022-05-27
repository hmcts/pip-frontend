import config from 'config';
import process from 'process';

const appInsights = require('applicationinsights');

export class AppInsights {

  enable(): void {
    if(process.env.INSTRUMENTATION_KEY) {
      console.log('Do not start app insights');
    } else {
      appInsights.setup(config.get('secrets.pip-ss-kv.INSTRUMENTATION_KEY'))
        .setSendLiveMetrics(true)
        .start();

      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'pip-frontend';
      appInsights.defaultClient.trackTrace({message: 'App insights activated'});
    }
  }
}
