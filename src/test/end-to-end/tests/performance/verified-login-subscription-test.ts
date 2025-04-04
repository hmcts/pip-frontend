Feature('Login - Performance');

//This value can be changed to determine how many tests should run.
//The number of concurrent logins can be changed via the 'run-workers' setting, in the package.json
for (let i = 0; i < 10; i++) {
    Scenario(
        'I as a verified user should be able to sign-in with the valid credentials and see the subscription screen ' +
            i,
        async ({ I }) => {
            I.loginAsMediaUser();
            I.click('#card-subscription-management');
            I.waitForText('Your email subscriptions');
            I.logout();
        }
    ).tag('@Performance');
}
