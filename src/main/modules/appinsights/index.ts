import config from 'config';
import process from 'process';
import { setup, defaultClient } from 'applicationinsights';

export class AppInsights {
    enable(): void {
        let appInsightsConnectionString;
        if (process.env.APP_INSIGHTS_CONNECTION_STRING) {
            appInsightsConnectionString = process.env.APP_INSIGHTS_CONNECTION_STRING;
        } else if (config.get('secrets.pip-ss-kv.APP_INSIGHTS_CONNECTION_STRING')) {
            appInsightsConnectionString = config.get('secrets.pip-ss-kv.APP_INSIGHTS_CONNECTION_STRING');
        }

        if (appInsightsConnectionString) {
            setup(appInsightsConnectionString).setSendLiveMetrics(true).start();

            defaultClient.context.tags[defaultClient.context.keys.cloudRole] = 'pip-frontend';
            defaultClient.trackTrace({
                message: 'App insights activated',
            });
        }
    }
}
