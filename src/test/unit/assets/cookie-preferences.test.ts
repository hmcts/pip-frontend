//Marking these as skipped. The cookies preferences library requires us to add extra options to transpile it in the
//jest / ts configs. Doing this however causes the tests to run extremely slowly.

describe.skip('Cookie policy', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('should contain default preferences on page load', async () => {
        window.dataLayer = [];

        await import('../../../main/bundles/cookie-preferences');

        expect(window.dataLayer.length).toEqual(1);

        const defaultSetting = window.dataLayer[0];
        expect(defaultSetting['event']).toEqual('Cookie Preferences');
        expect(defaultSetting['cookiePreferences']).toEqual({
            analytics: 'off',
            apm: 'off',
        });
    });

    it('Test updating of the datalayer for when user clicks save', async () => {
        const mockEnable = jest.fn(() => 5);
        const mockEnableSessionReplay = jest.fn(() => 5);

        window.dtrum = {
            enable: mockEnable,
            enableSessionReplay: mockEnableSessionReplay,
        };
        window.dataLayer = [];

        document.body.innerHTML = '<div></div>';

        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        const acceptButton = document.createElement('button');
        acceptButton.className = 'cookie-banner-accept-button';

        banner.appendChild(acceptButton);
        document.getElementsByTagName('div')[0].appendChild(banner);

        const acceptButtonAction = () =>
            document.getElementsByClassName('cookie-banner-accept-button')[0] as HTMLDivElement;

        await import('../../../main/bundles/cookie-preferences');

        const clickEvent = () =>
            new Event('click', {
                bubbles: false,
                cancelable: false,
                composed: false,
            });
        acceptButtonAction().dispatchEvent(clickEvent());

        const defaultSetting = window.dataLayer[1];
        expect(defaultSetting['event']).toEqual('Cookie Preferences');
        expect(defaultSetting['cookiePreferences']).toEqual({
            analytics: 'on',
            apm: 'on',
        });
        expect(mockEnable.mock.calls.length).toEqual(1);
        expect(mockEnableSessionReplay.mock.calls.length).toEqual(1);
    });
});
