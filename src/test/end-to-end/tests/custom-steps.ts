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
            this.click('Sign in');
        },

        loginAsAdmin: function (username = testConfig.ADMIN_USERNAME, password = testConfig.ADMIN_PASSWORD) {
            this.amOnPage('/admin-dashboard');
            this.see('Sign in with your email address');
            this.fillField('#email', secret(username));
            this.fillField('#password', secret(password));
            this.click('Sign in');
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
        },

        logout: function () {
            this.click('Sign out');
            this.see('You have been signed out');
        },
    });
};
