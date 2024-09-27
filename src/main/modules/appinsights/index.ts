import config from 'config';
import process from 'process';
import { setup, defaultClient } from 'applicationinsights';

export class AppInsights {
    enable(): void {
        let appInsightsKey;
        if (process.env.INSTRUMENTATION_KEY) {
            appInsightsKey = process.env.INSTRUMENTATION_KEY;
        } else if (config.get('secrets.pip-ss-kv.INSTRUMENTATION_KEY')) {
            appInsightsKey = config.get('secrets.pip-ss-kv.INSTRUMENTATION_KEY');
        }

        if (appInsightsKey) {
            setup(appInsightsKey).setSendLiveMetrics(true).start();

            defaultClient.context.tags[defaultClient.context.keys.cloudRole] = 'pip-frontend';
            defaultClient.trackTrace({
                message: 'App insights activated',
            });
        }
    }
}
