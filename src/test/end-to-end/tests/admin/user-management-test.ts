import {config as testConfig} from "../../../config";

Feature('Manage admin user accounts');

const TEST_FIRST_NAME = testConfig.TEST_SUITE_PREFIX + 'FirstName';
const TEST_LAST_NAME = testConfig.TEST_SUITE_PREFIX + 'Surname';
const EMAIL = testConfig.TEST_SUITE_PREFIX + 'email@test.com';
const ROLE = 'Local Admin';
Scenario('I as an admin user should be able to modify a user account', async ({ I }) => {
    // I.amOnPage('/');
    // I.click('Continue');
    I.loginAsAdmin();
    // I.amOnPage('/admin-dashboard');

    I.createAdminAccount(TEST_FIRST_NAME, TEST_LAST_NAME, EMAIL, ROLE);
    // I.waitForText('Your Dashboard');
    // I.see('Update and delete users.');
    // I.click('#card-admin-management');
    // I.waitForText('What is the users email address?');
    // I.fillField('#search-input', EMAIL);
    // I.click('Continue');






    // I.see('Create accounts for: CTSC Super Admin, Local Super Admin, CTSC Admin, Local Admin.');
    // I.click('#card-create-admin-account');
    // I.waitForText('Create admin account');
    // I.fillField('#firstName', TEST_FIRST_NAME);
    // I.fillField('#lastName', TEST_LAST_NAME);
    // I.fillField('#emailAddress', EMAIL);
    // I.click('#user-role');
    // I.click('Continue');
});
