import { config as testConfig } from '../../config';

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
            this.click('Sign in', null, { noWaitAfter: true });
        },

        loginAsAdmin: function (username = testConfig.ADMIN_USERNAME, password = testConfig.ADMIN_PASSWORD) {
            this.amOnPage('/admin-dashboard');
            this.see('Sign in with your email address');
            this.fillField('#email', secret(username));
            this.fillField('#password', secret(password));
            this.click('Sign in', null, { noWaitAfter: true });
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
            this.click('Sign in', null, { noWaitAfter: true });
        },

        loginAsCftUser: function (username = testConfig.CFT_USERNAME, password = testConfig.CFT_PASSWORD) {
            this.amOnPage('/sign-in');
            this.click('With a MyHMCTS account');
            this.click('Continue');
            this.see('Sign in');
            this.fillField('#username', secret(username));
            this.fillField('#password', secret(password));
            this.click('Sign in', null, { noWaitAfter: true });
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
            this.see('You have been signed out');
        },

        logoutWelsh: function () {
            this.click('Allgofnodi');
            this.see('Rydych wedi cael eich allgofnodi');
        },

        createAdminAccount: function (firstName, lastName, email, role) {
            this.amOnPage('/admin-dashboard');
            this.see('Your Dashboard');
            this.click('#card-create-admin-account');
            this.fillField('#firstName', firstName);
            this.fillField('#lastName', lastName);
            this.fillField('#emailAddress', email);
            this.click(role);
            this.click('Continue');
            this.see('Check account details');
            this.click('Confirm');
            this.see('Account has been created');
        },

        createNewSystemAdminAndContinue: function (firstName, surname, email) {
            this.click('Create System Admin');
            this.waitForText('Create system admin account');
            this.fillField('#firstName', firstName);
            this.fillField('#lastName', surname);
            this.fillField('#emailAddress', email);
            this.click('Continue');
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

        deleteAdminAccount: function (email) {
            this.amOnPage('/admin-dashboard');
            this.waitForText('Your Dashboard');
            this.click('#card-admin-management');
            this.waitForText('What is the users email address?');
            this.fillField('#search-input', email);
            this.click('Continue');
            this.waitForText('Manage ' + email);
            this.click('Delete user');
            this.waitForText('Are you sure you want to delete ' + email);
            this.click('#delete-user-confirm');
            this.click('Continue');
            this.waitForText('User Deleted');
        },
    });
};
