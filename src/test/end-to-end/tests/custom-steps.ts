import { config as testConfig } from '../../config';
import { checkA11y, injectAxe } from 'axe-playwright';

export = function () {
    return actor({
        loginAsB2CSystemAdmin: function () {
            this.usePlaywrightTo('Go to b2c system admin login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/b2c-admin-login');
            });
            this.waitForText('Sign in with your email address');
            this.fillField('#email', secret(testConfig.SYSTEM_ADMIN_USERNAME));
            this.fillField('#password', secret(testConfig.SYSTEM_ADMIN_PASSWORD));
            this.click('Sign in');
            this.waitForText('System Admin Dashboard');
        },

        loginAsB2CAdmin: function () {
            this.usePlaywrightTo('Go to b2c admin login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/b2c-admin-login');
            });
            this.waitForText('Sign in with your email address');
            this.fillField('#email', secret(testConfig.ADMIN_USERNAME));
            this.fillField('#password', secret(testConfig.ADMIN_PASSWORD));
            this.click('Sign in');
            this.waitForText('Your Dashboard');
        },

        loginTestB2CAdminUser: function (username, password) {
            this.usePlaywrightTo('Go to b2c admin login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/b2c-admin-login');
            });
            this.waitForText('Sign in with your email address');
            this.fillField('#email', username);
            this.fillField('#password', password);
            this.click('Sign in');
        },

        loginAsSsoSystemAdmin: function () {
            this.usePlaywrightTo('Go to SSO login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/admin-dashboard');
            });
            this.waitForText('Sign in');
            this.fillField('loginfmt', secret(testConfig.SSO_TEST_SYSTEM_ADMIN_USER));
            this.click('Next');
            this.waitForText('Enter password');
            this.fillField('passwd', secret(testConfig.SSO_TEST_SYSTEM_ADMIN_PWD));
            this.click('Sign in');
            this.waitForText('Stay signed in?');
            this.click('No');
            this.waitForText('System Admin Dashboard');
        },

        loginAsSsoAdminCtsc: function () {
            this.usePlaywrightTo('Go to SSO login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/admin-dashboard');
            });
            this.waitForText('Sign in');
            this.fillField('loginfmt', secret(testConfig.SSO_TEST_ADMIN_CTSC_USER));
            this.click('Next');
            this.waitForText('Enter password');
            this.fillField('passwd', secret(testConfig.SSO_TEST_ADMIN_CTSC_PWD));
            this.click('Sign in');
            this.waitForText('Stay signed in?');
            this.click('No');
            this.waitForText('Your Dashboard');
        },

        loginAsSsoAdminLocal: function () {
            this.usePlaywrightTo('Go to SSO login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/admin-dashboard');
            });
            this.waitForText('Sign in');
            this.fillField('loginfmt', secret(testConfig.SSO_TEST_ADMIN_LOCAL_USER));
            this.click('Next');
            this.waitForText('Enter password');
            this.fillField('passwd', secret(testConfig.SSO_TEST_ADMIN_LOCAL_PWD));
            this.click('Sign in');
            this.waitForText('Stay signed in?');
            this.click('No');
            this.waitForText('Your Dashboard');
        },

        loginAsNoRoleSsoUser: function () {
            this.usePlaywrightTo('Go to SSO login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/admin-dashboard');
            });
            this.waitForText('Sign in');
            this.fillField('loginfmt', secret(testConfig.SSO_TEST_NO_ROLES_USER));
            this.click('Next');
            this.waitForText('Enter password');
            this.fillField('passwd', secret(testConfig.SSO_TEST_NO_ROLES_PWD));
            this.click('Sign in');
            this.waitForText('Stay signed in?');
            this.click('No');
        },

        reloginAsSsoSystemAdmin: function () {
            this.usePlaywrightTo('Go to SSO login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/admin-dashboard');
            });
            this.waitForText('Pick an account');
            this.click('Use another account');
            this.waitForText('Sign in');
            this.fillField('loginfmt', secret(testConfig.SSO_TEST_SYSTEM_ADMIN_USER));
            this.click('Next');
            this.waitForText('Enter password');
            this.fillField('passwd', secret(testConfig.SSO_TEST_SYSTEM_ADMIN_PWD));
            this.click('Sign in');
        },

        loginAsMediaUser: function () {
            this.usePlaywrightTo('Go to media login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/sign-in');
            });
            this.click('With a Court and tribunal hearings account');
            this.click('Continue');
            this.waitForText('Sign in with your email address');
            this.fillField('#email', secret(testConfig.MEDIA_USER_USERNAME));
            this.fillField('#password', secret(testConfig.MEDIA_USER_PASSWORD));
            this.click('Sign in');
            this.waitForText('Your account');
        },

        loginTestMediaUser: function (username, password) {
            this.usePlaywrightTo('Go to media login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/sign-in');
            });
            this.click('With a Court and tribunal hearings account');
            this.click('Continue');
            this.waitForText('Sign in with your email address');
            this.fillField('#email', username);
            this.fillField('#password', password);
            this.click('Sign in');
        },

        loginAsCftUser: function () {
            this.usePlaywrightTo('Go to cft login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/sign-in');
            });
            this.click('With a MyHMCTS account');
            this.click('Continue');
            this.waitForText('Sign in');
            this.fillField('#username', secret(testConfig.CFT_USERNAME));
            this.fillField('#password', secret(testConfig.CFT_PASSWORD));
            this.click('Sign in');
            this.waitForText('Your account');
        },

        loginTestCftUser: function (username, password) {
            this.usePlaywrightTo('Go to cft login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/sign-in');
            });
            this.click('With a MyHMCTS account');
            this.click('Continue');
            this.waitForText('Sign in');
            this.fillField('#username', username);
            this.fillField('#password', password);
            this.click('Sign in');
        },

        loginAsCftUserInWelsh: function (username, password) {
            this.usePlaywrightTo('Go to cft Welsh login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/sign-in');
            });
            this.click('Cymraeg');
            this.click('Gyda chyfrif MyHMCTS');
            this.click('Parhau');
            this.waitForText('Mewngofnodi');
            this.fillField('#username', username);
            this.fillField('#password', password);
            this.click('Mewngofnodi');
        },

        seeBetaFeedbackOnPage: function (page) {
            this.waitForText('BETA');
            this.click('feedback');
            this.seeInCurrentUrl(`https://www.smartsurvey.co.uk/s/FBSPI22/?pageurl=${page}`);
        },

        logout: function () {
            this.click('Sign out');
            this.waitForText('You have been signed out');
        },

        logoutSsoSystemAdmin: function () {
            this.click('Sign out');
            this.waitForText('Pick an account');
            this.click(locate('//div').withText(testConfig.SSO_TEST_SYSTEM_ADMIN_USER as string));
            this.waitForText('You have been signed out');
        },

        logoutSsoAdminCtsc: function () {
            this.click('Sign out');
            this.waitForText('Pick an account');
            this.click(locate('//div').withText(testConfig.SSO_TEST_ADMIN_CTSC_USER as string));
            this.waitForText('You have been signed out');
        },

        logoutSsoAdminLocal: function () {
            this.click('Sign out');
            this.waitForText('Pick an account');
            this.click(locate('//div').withText(testConfig.SSO_TEST_ADMIN_LOCAL_USER as string));
            this.waitForText('You have been signed out');
        },

        logoutWelsh: function () {
            this.click('Allgofnodi');
            this.waitForText('Rydych wedi cael eich allgofnodi');
        },

        requestMediaAccount: function (fullName, email, emplyerName) {
            this.usePlaywrightTo('Go to home page', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/');
            });
            this.waitForText('Court and tribunal hearings');
            this.click('Continue');
            this.click('Sign in');
            this.waitForText("Don't have an account?");
            this.click('Create a Court and tribunal hearings account');
            this.waitForText('Create a Court and tribunal hearings account');
            this.fillField('#fullName', fullName);
            this.fillField('#emailAddress', email);
            this.fillField('#employer', emplyerName);
            this.attachFile('file-upload', './shared/mocks/testFile.pdf');
            this.click('#tcbox');
            this.click('Continue');
            this.waitForText('Details submitted');
        },

        checkA11y(fileName: string) {
            this.runA11yCheck({ reportFileName: fileName });
            this.usePlaywrightTo('Run accessibility tests', async ({ page }) => {
                await injectAxe(page);
                await checkA11y(page, undefined, undefined, true);
            });
        },
    });
};
