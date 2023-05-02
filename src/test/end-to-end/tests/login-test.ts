import {config as testConfig} from "../../config";

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

Scenario('I as a admin should be able to see the beta tag and feedback link when logging in', async ({ I }) => {
    I.amOnPage('/admin-dashboard');
    I.waitForText('Sign in with your email address');
    I.seeBetaFeedbackOnPage('b2c/login');
    I.executeScript('window.history.back();');
    I.click('Forgot your password?');
    I.waitForText('Please provide the following details.');
    I.seeBetaFeedbackOnPage('b2c/reset-pw');
});

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

Scenario('I as a media user should be able to see the beta tag and feedback link when logging in', async ({ I }) => {
    I.amOnPage('/sign-in');
    I.click('With a Court and tribunal hearings account');
    I.click('Continue');
    I.waitForText('Sign in with your email address');
    I.seeBetaFeedbackOnPage('b2c/login');
    I.executeScript('window.history.back();');
    I.click('Forgot your password?');
    I.waitForText('Please provide the following details.');
    I.seeBetaFeedbackOnPage('b2c/reset-pw');
});

Scenario('I as a media user should see the media rejected login screen when logging in via the admin flow', async ({ I }) => {
    I.loginAsAdmin(testConfig.MEDIA_USER_USERNAME, testConfig.MEDIA_USER_PASSWORD);
    I.waitForText('Sign in failed');
    I.see('Please always sign in using the following link below to sign in with your court and tribunal hearings account.');
    I.see('/sign-in');
}).tag('@Testing');

Scenario('I as a admin user should see the admin rejected login screen when logging in via the media flow', async ({ I }) => {
    I.loginAsMediaUser(testConfig.ADMIN_USERNAME, testConfig.ADMIN_PASSWORD);
    I.waitForText('Sign in failed');
    I.see('Please always sign in using the following link below to sign in as a court and tribunal hearings service Super Admin or Admin user');
    I.see('/admin-dashboard');
}).tag("@Testing");
