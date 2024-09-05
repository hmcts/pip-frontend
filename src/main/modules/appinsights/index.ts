import config from 'config';
import process from 'process';

const appInsights = require('applicationinsights');

export class AppInsights {
    enable(): void {
        let appInsightsConnectionString;
        if (process.env.APP_INSIGHTS_CONNECTION_STRING) {
            appInsightsConnectionString = process.env.APP_INSIGHTS_CONNECTION_STRING;
        } else if (config.has('secrets.pip-ss-kv.APP_INSIGHTS_CONNECTION_STRING')) {
            appInsightsConnectionString = config.get('secrets.pip-ss-kv.APP_INSIGHTS_CONNECTION_STRING');
        }

        if (appInsightsConnectionString) {
            appInsights.setup(appInsightsConnectionString).setSendLiveMetrics(true).start();

            appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'pip-frontend';
            appInsights.defaultClient.trackTrace({
                message: 'App insights activated',
            });
        }
    }
}
