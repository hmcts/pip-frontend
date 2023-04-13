Feature('Login');

Scenario('I as a system admin should be able to sign-in with the valid credentials', async ({ I }) => {
    I.loginAsSystemAdmin();
    I.see('System Admin Dashboard');
    I.logout();
}).tag('@CrossBrowser');

Scenario(
    'I as a system admin should be able to see proper error messages when username or password fields are empty',
    async ({ I }) => {
        I.loginAsSystemAdmin('', '');
        I.see('Please enter your Email Address');
        I.see('Please enter your password');
    }
).tag('@Nightly');

Scenario(
    'I as a system admin should be able to see proper error message when username or password is wrong',
    async ({ I }) => {
        I.loginAsSystemAdmin('email@justice.gov.uk', 'password');
        I.see('Invalid username or password.');
    }
).tag('@Nightly');

Scenario(
    'I as a system admin should be able to see proper error message when username is not a valid email address',
    async ({ I }) => {
        I.loginAsSystemAdmin('email..@justice.gov.uk', 'password');
        I.see('Please enter a valid email address.');
    }
).tag('@Nightly');

Scenario('I as a admin should be able to sign-in with the valid credentials', async ({ I }) => {
    I.loginAsAdmin();
    I.see('Your Dashboard');
    I.logout();
}).tag('@CrossBrowser');

Scenario(
    'I as a admin should be able to see proper error messages when username or password fields are empty',
    async ({ I }) => {
        I.loginAsAdmin('', '');
        I.see('Please enter your Email Address');
        I.see('Please enter your password');
    }
).tag('@Nightly');

Scenario(
    'I as a admin should be able to see proper error message when username or password is wrong',
    async ({ I }) => {
        I.loginAsAdmin('email@justice.gov.uk', 'password');
        I.see('Invalid username or password.');
    }
).tag('@Nightly');

Scenario(
    'I as a admin should be able to see proper error message when username is not a valid email address',
    async ({ I }) => {
        I.loginAsAdmin('email..@justice.gov.uk', 'password');
        I.see('Please enter a valid email address.');
    }
).tag('@Nightly');

// TODO: to be enabled once the beta feedback changes on Azure pages has gone in
Scenario.skip('I as a admin should be able to see the beta tag and feedback link when logging in', async ({ I }) => {
    I.amOnPage('/admin-dashboard');
    I.seeBetaFeedbackOnPage('b2c/login');
    I.executeScript('window.history.back();');
    I.click('Forgot your password?');
    I.seeBetaFeedbackOnPage('b2c/reset-pw');
}).tag('@Nightly');

Scenario('I as a media user should be able to sign-in with the valid credentials', async ({ I }) => {
    I.loginAsMediaUser();
    I.see('Your account');
    I.logout();
}).tag('@CrossBrowser');

Scenario(
    'I as a media user should be able to see proper error messages when username or password fields are empty',
    async ({ I }) => {
        I.loginAsMediaUser('', '');
        I.see('Please enter your Email Address');
        I.see('Please enter your password');
    }
).tag('@Nightly');

Scenario(
    'I as a media user should be able to see proper error message when username or password is wrong',
    async ({ I }) => {
        I.loginAsMediaUser('email@justice.gov.uk', 'password');
        I.see('Invalid username or password.');
    }
).tag('@Nightly');

Scenario(
    'I as a media user should be able to see proper error message when username is not a valid email address',
    async ({ I }) => {
        I.loginAsMediaUser('email..@justice.gov.uk', 'password');
        I.see('Please enter a valid email address.');
    }
).tag('@Nightly');

// TODO: to be enabled once the beta feedback changes on Azure pages has gone in
Scenario.skip(
    'I as a media user should be able to see the beta tag and feedback link when logging in',
    async ({ I }) => {
        I.amOnPage('/sign-in');
        I.click('With a Court and tribunal hearings account');
        I.click('Continue');
        I.seeBetaFeedbackOnPage('b2c/login');
        I.executeScript('window.history.back();');
        I.click('Forgot your password?');
        I.seeBetaFeedbackOnPage('b2c/reset-pw');
    }
).tag('@Nightly');
