beforeAll(async () => {
    //This is only required globally for certain tests, as they require the app state to be setup
    if (
        expect.getState().testPath.includes('/src/test/unit/views') ||
        expect.getState().testPath.includes('/src/test/routes') ||
        expect.getState().testPath.includes('/src/test/a11y')
    ) {
        const app = await import('./src/main/app');
        await app.appSetup();
    }
});
