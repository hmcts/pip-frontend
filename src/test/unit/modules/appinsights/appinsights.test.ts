const mockTrackTrace = jest.fn();
const mockSetSendLiveMetrics = jest.fn().mockReturnThis();
const mockStart = jest.fn().mockReturnThis();

jest.mock('applicationinsights', () => {
    return {
        setup: jest.fn(() => ({
            setSendLiveMetrics: mockSetSendLiveMetrics,
            start: mockStart,
        })),
        defaultClient: {
            context: {
                tags: {},
                keys: {
                    cloudRole: 'undefined-frontend',
                },
            },
            trackTrace: mockTrackTrace,
        },
    };
});

import * as appInsights from 'applicationinsights';
import { AppInsights } from '../../../../main/modules/appinsights';

jest.mock('config', () => ({
    get: jest.fn(() => {
        return 'CONFIG_CONNECTION_STRING';
    }),
}));

describe('App Insights', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        delete process.env.APP_INSIGHTS_CONNECTION_STRING;
        appInsights.defaultClient.context.tags = {};
    });

    it('Uses environment variable for connection string', () => {
        process.env.APP_INSIGHTS_CONNECTION_STRING = 'ENV_CONNECTION_STRING';
        const appInsightsLibrary = new AppInsights();
        appInsightsLibrary.enable();

        expect(appInsights.setup).toHaveBeenCalledWith('ENV_CONNECTION_STRING');
        expect(mockSetSendLiveMetrics).toHaveBeenCalledWith(true);
        expect(mockStart).toHaveBeenCalled();
        expect(appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole]).toBe(
            'pip-frontend'
        );
        expect(mockTrackTrace).toHaveBeenCalledWith({ message: 'App insights activated' });
    });

    it('Uses config for connection string if env not set', () => {
        const appInsightsLibrary = new AppInsights();
        appInsightsLibrary.enable();

        expect(appInsights.setup).toHaveBeenCalledWith('CONFIG_CONNECTION_STRING');
        expect(mockSetSendLiveMetrics).toHaveBeenCalledWith(true);
        expect(mockStart).toHaveBeenCalled();
        expect(appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole]).toBe(
            'pip-frontend'
        );
        expect(mockTrackTrace).toHaveBeenCalledWith({ message: 'App insights activated' });
    });

    it('does nothing if no connection string is available', async () => {
        jest.resetModules();
        jest.doMock('config', () => ({
            get: jest.fn(() => undefined),
        }));
        delete process.env.APP_INSIGHTS_CONNECTION_STRING;

        const { AppInsights: AppInsightsNoConfig } = await import('../../../../main/modules/appinsights');
        const appInsightsLibrary = new AppInsightsNoConfig();
        appInsightsLibrary.enable();

        expect(appInsights.setup).not.toHaveBeenCalled();
        expect(mockSetSendLiveMetrics).not.toHaveBeenCalled();
        expect(mockStart).not.toHaveBeenCalled();
        expect(mockTrackTrace).not.toHaveBeenCalled();
    });
});
