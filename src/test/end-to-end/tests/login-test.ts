import { config as testConfig } from '../../config';

Feature('Login');

Scenario('I as a media user should be able to sign-in with the valid credentials', async ({ I }) => {
    I.loginAsMediaUser();
    I.logout();
})
    .tag('@CrossBrowser')
    .tag('@Smoke');

Scenario(
    'I as a media user should be able to see proper error messages when username or password fields are empty',
    async ({ I }) => {
        I.loginTestMediaUser('', '');
        I.waitForText('Please enter your Email Address');
        I.see('Please enter your password');
    }
).tag('@Nightly');

Scenario(
    'I as a media user should be able to see proper error message when username or password is wrong',
    async ({ I }) => {
        I.loginTestMediaUser('email@justice.gov.uk', 'password');
        I.waitForText('Invalid username or password.');
    }
).tag('@Nightly');

Scenario(
    'I as a media user should be able to see proper error message when username is not a valid email address',
    async ({ I }) => {
        I.loginTestMediaUser('email..@justice.gov.uk', 'password');
        I.waitForText('Please enter a valid email address.');
    }
).tag('@Nightly');

Scenario('I as a media user should be able to see the beta tag and feedback link when logging in', async ({ I }) => {
    I.usePlaywrightTo('Go to home page', async ({ page }) => {
        page.goto(testConfig.TEST_URL + '/sign-in');
    });
    I.waitForText('With a Court and tribunal hearings account');
    I.click('With a Court and tribunal hearings account');
    I.click('Continue');
    I.waitForText('Sign in with your email address');
    I.seeBetaFeedbackOnPage('b2c/login');
    I.executeScript('window.history.back();');
    I.click('Forgot your password?');
    I.waitForText('Please provide the following details.');
    I.seeBetaFeedbackOnPage('b2c/reset-pw');
});

Scenario('I as a SSO system admin should be able to sign-in with the valid credentials', async ({ I }) => {
    I.loginAsSsoSystemAdmin();
    I.logoutSsoSystemAdmin();
}).tag('@Smoke');

Scenario('I as a SSO CTSC admin should be able to sign-in with the valid credentials', async ({ I }) => {
    I.loginAsSsoAdminCtsc();
    I.see('Upload');
    I.see('Remove');
    I.see('Manage media account requests');
    I.logoutSsoAdminCtsc();
});

Scenario('I as a SSO Local admin should be able to sign-in with the valid credentials', async ({ I }) => {
    I.loginAsSsoAdminLocal();
    I.see('Upload');
    I.see('Remove');
    I.dontSee('Manage media account requests');
    I.logoutSsoAdminLocal();
});

Scenario('I as a SSO user with no admin roles should not be able to sign in', async ({ I }) => {
    I.loginAsNoRoleSsoUser();
    I.waitForText(
        'Unfortunately, you do not have an account for the Court and tribunal hearings service admin dashboard.'
    );
});
