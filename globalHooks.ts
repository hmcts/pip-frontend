//This is used to globally run the app setup, which is not run by default now that it is moved into an async function.

beforeAll(async () => {
    //This is only required globally for certain tests, as they require the app state to be setup
    const path = expect.getState().testPath;
    if (
        path.includes('/src/test/unit/views') ||
        path.includes('/src/test/routes') ||
        path.includes('/src/test/a11y')
    ) {
        const app = await import('./src/main/app');
        await app.appSetup();
    }
});
