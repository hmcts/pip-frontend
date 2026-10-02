import { config as testConfig } from '../../config';
import { checkA11y, injectAxe } from 'axe-playwright';
import { tryTo } from 'codeceptjs/effects';

export = function () {
    return actor({
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
            this.waitForText('With a Court and tribunal hearings account');
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
            this.waitForText('With a Court and tribunal hearings account');
            this.click('With a Court and tribunal hearings account');
            this.click('Continue');
            this.waitForText('Sign in with your email address');
            this.fillField('#email', username);
            this.fillField('#password', password);
            this.click('Sign in');
        },

        doCftIdamLogin: function (username, password) {
            // CLASSIC
            tryTo(() => {
                this.waitForText('Sign in');
                this.waitForElement('#username', 10);
                this.fillField('#username', username);
                this.fillField('#password', password);
                this.click('Sign in');
                this.waitForText('Your account');
            });
            // MODERN
            tryTo(() => {
                this.waitForText('Enter your email address');
                this.waitForElement('#email', 10);
                this.fillField('#email', username);
                this.click('Continue');
                this.waitForElement('#password', 10);
                this.fillField('#password', password);
                this.click('Continue');
                this.waitForText('Your account');
            });
        },

        doCftIdamLoginWelsh: function (username, password) {
            // CLASSIC (Welsh)
            tryTo(() => {
                this.waitForText('Mewngofnodi');
                this.seeElement('#username');
                this.fillField('#username', username);
                this.seeElement('#password');
                this.fillField('#password', password);
                this.click('Mewngofnodi');
            });
            // MODERN (Welsh)
            tryTo(() => {
                this.waitForText('Nodwch eich cyfeiriad e-bost i fewngofnodi i’ch cyfrif HMCTS Access');
                this.seeElement('#email');
                this.fillField('#email', username);
                this.click('Parhau');
                this.seeElement('#password');
                this.fillField('#password', password);
                this.click('Parhau');
            });
        },

        loginAsCftUser: async function () {
            this.usePlaywrightTo('Go to cft login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/sign-in');
            });
            this.waitForText('With a MyHMCTS account');
            this.click('With a MyHMCTS account');
            this.click('Continue');
            await this.doCftIdamLogin(secret(testConfig.CFT_USERNAME), secret(testConfig.CFT_PASSWORD));
        },

        loginTestCftUser: async function (username, password) {
            this.usePlaywrightTo('Go to cft login', async ({ page }) => {
                page.goto(testConfig.TEST_URL + '/sign-in');
            });
            this.waitForText('With a MyHMCTS account');
            this.click('With a MyHMCTS account');
            this.click('Continue');
            this.doCftIdamLogin(username, password);
        },

        loginAsCftUserInWelsh: async function (username, password) {
            this.usePlaywrightTo('Go to cft Welsh login', async ({ page }) => {
                await page.goto(testConfig.TEST_URL + '/sign-in');
            });
            this.waitForText('With a MyHMCTS account');
            this.click('Cymraeg');
            this.click('Gyda chyfrif MyHMCTS');
            this.click('Parhau');
            this.doCftIdamLoginWelsh(username, password);
        },

        loginAsCrimeUser: function (
            username = testConfig.CRIME_VALID_USERNAME,
            password = testConfig.CRIME_VALID_PASSWORD
        ) {
            this.amOnPage('/sign-in');
            this.click('With a Common Platform account');
            this.click('Continue');
            this.see('Sign in to Common Platform');
            this.fillField('#idToken1', secret(username));
            this.fillField('#idToken2', secret(password));
            this.click('Sign in');
        },

        loginAsCrimeUserInWelsh: function (
            username = testConfig.CRIME_VALID_USERNAME,
            password = testConfig.CRIME_VALID_PASSWORD
        ) {
            this.amOnPage('/sign-in');
            this.click('Cymraeg');
            this.click('Gyda chyfrif Common Platform');
            this.click('Parhau');
            this.see('Sign in to Common Platform');
            this.fillField('#idToken1', secret(username));
            this.fillField('#idToken2', secret(password));
            this.click('Sign in');
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
