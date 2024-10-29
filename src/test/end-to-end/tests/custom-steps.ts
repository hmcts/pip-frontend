import { config as testConfig } from '../../config';
import { checkA11y, injectAxe } from 'axe-playwright';

export = function () {
    return actor({
        loginAsSystemAdmin: function (
            username = testConfig.SYSTEM_ADMIN_USERNAME,
            password = testConfig.SYSTEM_ADMIN_PASSWORD
        ) {
            this.amOnPage('/system-admin-dashboard');
            this.see('Sign in with your email address');
            this.fillField('#email', secret(username));
            this.fillField('#password', secret(password));
            this.click('Sign in');
            this.waitForText('System Admin Dashboard');
        },

        loginTestSystemAdmin: function (
            username = testConfig.SYSTEM_ADMIN_USERNAME,
            password = testConfig.SYSTEM_ADMIN_PASSWORD
        ) {
            this.amOnPage('/system-admin-dashboard');
            this.see('Sign in with your email address');
            this.fillField('#email', secret(username));
            this.fillField('#password', secret(password));
            this.click('Sign in');
        },

        loginAsAdmin: function (username = testConfig.ADMIN_USERNAME, password = testConfig.ADMIN_PASSWORD) {
            this.amOnPage('/admin-dashboard');
            this.see('Sign in with your email address');
            this.fillField('#email', secret(username));
            this.fillField('#password', secret(password));
            this.click('Sign in');
            this.waitForText('Your Dashboard');
        },

        loginTestAdmin: function (username = testConfig.ADMIN_USERNAME, password = testConfig.ADMIN_PASSWORD) {
            this.amOnPage('/admin-dashboard');
            this.see('Sign in with your email address');
            this.fillField('#email', secret(username));
            this.fillField('#password', secret(password));
            this.click('Sign in');
        },

        loginAsSSOAdmin: function (username, password) {
            this.usePlaywrightTo('Go to SSO login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/sso-login');
            });
            this.waitForText('Sign in');
            this.fillField('loginfmt', username);
            this.click('Next');
            this.waitForText('Enter password');
            this.fillField('passwd', password);
            this.click('Sign in');
            this.waitForText('Stay signed in?');
            this.click('No');
        },

        loginAsMediaUser: function (
            username = testConfig.MEDIA_USER_USERNAME,
            password = testConfig.MEDIA_USER_PASSWORD
        ) {
            this.amOnPage('/sign-in');
            this.click('With a Court and tribunal hearings account');
            this.click('Continue');
            this.see('Sign in with your email address');
            this.fillField('#email', secret(username));
            this.fillField('#password', secret(password));
            this.click('Sign in');
            this.waitForText('Your account');
        },

        loginTestMediaUser: function (
            username = testConfig.MEDIA_USER_USERNAME,
            password = testConfig.MEDIA_USER_PASSWORD
        ) {
            this.amOnPage('/sign-in');
            this.click('With a Court and tribunal hearings account');
            this.click('Continue');
            this.see('Sign in with your email address');
            this.fillField('#email', secret(username));
            this.fillField('#password', secret(password));
            this.click('Sign in');
        },

        loginAsCftUser: function (username = testConfig.CFT_USERNAME, password = testConfig.CFT_PASSWORD) {
            this.amOnPage('/sign-in');
            this.click('With a MyHMCTS account');
            this.click('Continue');
            this.see('Sign in');
            this.fillField('#username', secret(username));
            this.fillField('#password', secret(password));
            this.click('Sign in');
            this.waitForText('Your account');
        },

        loginTestCftUser: function (username = testConfig.CFT_USERNAME, password = testConfig.CFT_PASSWORD) {
            this.amOnPage('/sign-in');
            this.click('With a MyHMCTS account');
            this.click('Continue');
            this.see('Sign in');
            this.fillField('#username', secret(username));
            this.fillField('#password', secret(password));
            this.click('Sign in');
        },

        loginAsCftUserInWelsh: function (username = testConfig.CFT_USERNAME, password = testConfig.CFT_PASSWORD) {
            this.amOnPage('/sign-in');
            this.click('Cymraeg');
            this.click('Gyda chyfrif MyHMCTS');
            this.click('Parhau');
            this.see('Mewngofnodi');
            this.fillField('#username', secret(username));
            this.fillField('#password', secret(password));
            this.click('Mewngofnodi');
        },

        seeBetaFeedbackOnPage: function (page) {
            this.see('BETA');
            this.click('feedback');
            this.seeInCurrentUrl(`https://www.smartsurvey.co.uk/s/FBSPI22/?pageurl=${page}`);
        },

        logout: function () {
            this.click('Sign out');
            this.waitForText('You have been signed out');
        },

        logoutWelsh: function () {
            this.click('Allgofnodi');
            this.waitForText('Rydych wedi cael eich allgofnodi');
        },

        requestMediaAccount: function (fullName, email, emplyerName) {
            this.amOnPage('/');
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
