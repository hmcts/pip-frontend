import config from 'config';
import process from 'process';

const appInsights = require('applicationinsights');

export class AppInsights {
    enable(): void {
        let appInsightsKey;
        if (process.env.INSTRUMENTATION_KEY) {
            appInsightsKey = process.env.INSTRUMENTATION_KEY;
        } else if (config.get('secrets.pip-ss-kv.INSTRUMENTATION_KEY')) {
            appInsightsKey = config.get('secrets.pip-ss-kv.INSTRUMENTATION_KEY');
        }

        if (appInsightsKey) {
            appInsights.setup(appInsightsKey).setSendLiveMetrics(true).start();

            appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'pip-frontend';
            appInsights.defaultClient.trackTrace({
                message: 'App insights activated',
            });
        }
    }
}
