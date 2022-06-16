describe('Cookie policy', () => {

  afterEach(() => {
    jest.resetModules();
  });

  it('should contain default preferences on page load', async () => {
    window.dataLayer = [];

    await import('../../../main/bundles/cookie-preferences');

    expect(window.dataLayer.length).toEqual(1);

    const defaultSetting = window.dataLayer[0];
    expect(defaultSetting['event']).toEqual('Cookie Preferences');
    expect(defaultSetting['cookiePreferences']).toEqual({'analytics': 'off', 'apm': 'off'});
  });
});
