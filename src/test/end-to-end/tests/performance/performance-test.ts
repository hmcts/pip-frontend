Feature('Login - Performance');

//This value can be changed to determine how many tests should run.
//The number of concurrent logins can be changed via the 'run-workers' setting, in the package.json
for (let i = 0; i < 10; i++) {
    Scenario('I as a system admin should be able to sign-in with the valid credentials ' + i, async ({ I }) => {
        I.loginAsB2CSystemAdmin();
        I.logout();
    }).tag('@Performance');
}
