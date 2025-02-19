import { config as testConfig } from '../../config';

Feature('Login');

Scenario('I as a system admin should be able to sign-in with the valid credentials', async ({ I }) => {
    I.loginAsB2CSystemAdmin();
    I.logout();
}).tag('@CrossBrowser');

Scenario(
    'I as a system admin should be able to see proper error messages when username or password fields are empty',
    async ({ I }) => {
        I.loginTestB2CAdminUser('', '');
        I.waitForText('Please enter your Email Address');
        I.see('Please enter your password');
    }
).tag('@Nightly');

Scenario(
    'I as a system admin should be able to see proper error message when username or password is wrong',
    async ({ I }) => {
        I.loginTestB2CAdminUser('email@justice.gov.uk', 'password');
        I.waitForText('Invalid username or password.');
    }
).tag('@Nightly');

Scenario(
    'I as a system admin should be able to see proper error message when username is not a valid email address',
    async ({ I }) => {
        I.loginTestB2CAdminUser('email..@justice.gov.uk', 'password');
        I.waitForText('Please enter a valid email address.');
    }
).tag('@Nightly');

Scenario('I as a admin should be able to sign-in with the valid credentials', async ({ I }) => {
    I.loginAsB2CAdmin();
    I.logout();
}).tag('@CrossBrowser');

Scenario(
    'I as a admin should be able to see proper error messages when username or password fields are empty',
    async ({ I }) => {
        I.loginTestB2CAdminUser('', '');
        I.waitForText('Please enter your Email Address');
        I.see('Please enter your password');
    }
).tag('@Nightly');

Scenario(
    'I as a admin should be able to see proper error message when username or password is wrong',
    async ({ I }) => {
        I.loginTestB2CAdminUser('email@justice.gov.uk', 'password');
        I.waitForText('Invalid username or password.');
    }
).tag('@Nightly');

Scenario(
    'I as a admin should be able to see proper error message when username is not a valid email address',
    async ({ I }) => {
        I.loginTestB2CAdminUser('email..@justice.gov.uk', 'password');
        I.waitForText('Please enter a valid email address.');
    }
).tag('@Nightly');

Scenario('I as a admin should be able to see the beta tag and feedback link when logging in', async ({ I }) => {

    I.usePlaywrightTo('Go to home page', async ({ page }) => {
        page.goto(testConfig.TEST_URL + '/b2c-admin-login');
    });
    I.waitForText('Sign in with your email address');
    I.seeBetaFeedbackOnPage('b2c/login');
    I.executeScript('window.history.back();');
    I.click('Forgot your password?');
    I.waitForText('Please provide the following details.');
    I.seeBetaFeedbackOnPage('b2c/reset-pw');
});

Scenario('I as a media user should be able to sign-in with the valid credentials', async ({ I }) => {
    I.loginAsMediaUser();
    I.logout();
}).tag('@CrossBrowser');

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
    I.click('With a Court and tribunal hearings account');
    I.click('Continue');
    I.waitForText('Sign in with your email address');
    I.seeBetaFeedbackOnPage('b2c/login');
    I.executeScript('window.history.back();');
    I.click('Forgot your password?');
    I.waitForText('Please provide the following details.');
    I.seeBetaFeedbackOnPage('b2c/reset-pw');
});

Scenario('I as a CFT user should be able to sign-in with the valid credentials in English', async ({ I }) => {
    I.loginAsCftUser();
    I.logout();
}).tag('@CrossBrowser');

Scenario('I as a CFT user should be able to sign-in with the valid credentials in Welsh', async ({ I }) => {
    I.loginAsCftUserInWelsh(secret(testConfig.CFT_USERNAME), secret(testConfig.CFT_PASSWORD));
    I.waitForText('Eich cyfrif');
    I.logoutWelsh();
}).tag('@CrossBrowser');

Scenario(
    'I as a CFT user should be able to see proper error message when email is invalid in English',
    async ({ I }) => {
        I.loginTestCftUser(testConfig.CFT_INVALID_USERNAME, testConfig.CFT_INVALID_PASSWORD);
        I.waitForText(
            'You have successfully signed into your MyHMCTS account. Unfortunately, ' +
                'your account role does not allow you to access the verified user part of the Court and tribunal hearings service'
        );
    }
).tag('@CrossBrowser');

Scenario('I as a CFT user should be able to see proper error message when email is invalid in Welsh', async ({ I }) => {
    I.loginAsCftUserInWelsh(testConfig.CFT_INVALID_USERNAME, testConfig.CFT_INVALID_PASSWORD);
    I.waitForText(
        'Rydych wedi mewngofnodi’n llwyddiannus i’ch cyfrif MyHMCTS. Yn anffodus, nid yw rôl eich cyfrif yn ' +
            'galluogi ichi gael mynediad at y rhan o wasanaeth gwrandawiadau’r llysoedd a’r tribiwnlysoedd ar ' +
            'gyfer defnyddwyr sydd wedi eu dilysu.'
    );
}).tag('@Nightly');

Scenario(
    'I as a CFT user should be able to see proper error messages when username or password fields are empty',
    async ({ I }) => {
        I.loginTestCftUser('', '');
        I.waitForText('Email address cannot be blank');
        I.see('Password cannot be blank');
    }
).tag('@Nightly');

Scenario(
    'I as a CFT user should be able to see proper error message when username or password is wrong',
    async ({ I }) => {
        I.loginTestCftUser('email@justice.gov.uk', 'password');
        I.waitForText('Incorrect email or password');
    }
).tag('@Nightly');

Scenario(
    'I as a CFT user should be able to see proper error message when username is not a valid email address',
    async ({ I }) => {
        I.loginTestCftUser('email..justice.gov.uk', 'password');
        I.waitForText('Email address is not valid');
        I.see('Email address is not valid');
    }
).tag('@Nightly');

Scenario(
    'I as a media user should see the media rejected login screen when logging in via the admin flow',
    async ({ I }) => {
        I.loginTestB2CAdminUser(secret(testConfig.MEDIA_USER_USERNAME), secret(testConfig.MEDIA_USER_PASSWORD));
        I.waitForText('Sign in failed');
        I.see(
            'Please always sign in using the following link below to sign in with your court and tribunal hearings account.'
        );
        I.see('/sign-in');
    }
);

Scenario(
    'I as a admin user should see the admin rejected login screen when logging in via the media flow',
    async ({ I }) => {
        I.loginTestMediaUser(secret(testConfig.ADMIN_USERNAME), secret(testConfig.ADMIN_PASSWORD));
        I.waitForText('Sign in failed');
        I.see(
            'Please always sign in using the following link below to sign in as a court and tribunal hearings service Super Admin or Admin user'
        );
        I.see('/admin-dashboard');
    }
);

Scenario('I as a SSO system admin should be able to sign-in with the valid credentials', async ({ I }) => {
    I.loginAsSsoSystemAdmin();
    I.logoutSsoSystemAdmin();
});

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
