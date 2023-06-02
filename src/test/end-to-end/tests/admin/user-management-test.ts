import { config as testConfig } from '../../../config';
import {randomData} from "../../shared/random-data";

Feature('Manage admin user accounts');

const TEST_WORKER_NUMBER = randomData.getRandomNumber(10000000, 99999999);
const TEST_FIRST_NAME = testConfig.TEST_SUITE_PREFIX + 'FirstName';
const TEST_LAST_NAME = testConfig.TEST_SUITE_PREFIX + 'Surname';
const TEST_EMAIL = randomData.getRandomEmailAddress(TEST_WORKER_NUMBER);
const TEST_ROLE = 'Internal - Administrator - Local';
const TEST_INVALID_EMAIL = 'invalid_email@test.com';

Scenario('I as an admin user should be able to modify a user account', async ({ I }) => {
    I.loginAsAdmin();
    I.waitForText('Your Dashboard');
    I.createAdminAccount(TEST_FIRST_NAME, TEST_LAST_NAME, TEST_EMAIL, TEST_ROLE);

    I.click('Home');
    I.see('Update and delete users.');
    I.click('#card-admin-management');
    I.waitForText('What is the users email address?');
    I.fillField('#search-input', TEST_EMAIL);
    I.click('Continue');
    I.waitForText('Manage ' + TEST_EMAIL);
    I.click('Change');
    I.waitForText('What role would you like ' + TEST_EMAIL + ' to have?');
    I.selectOption('updatedRole', 'CTSC Super Admin');
    I.click('Continue');
    I.waitForText('User Updated');

    I.click('Home');
    I.see('Update and delete users.');
    I.click('#card-admin-management');
    I.waitForText('What is the users email address?');
    I.fillField('#search-input', TEST_EMAIL);
    I.click('Continue');
    I.waitForText('Manage ' + TEST_EMAIL);
    I.click('Change');
    I.waitForText('What role would you like ' + TEST_EMAIL + ' to have?');
    I.selectOption('updatedRole', 'Local Super Admin');
    I.click('Continue');
    I.waitForText('User Updated');

    I.click('Home');
    I.see('Update and delete users.');
    I.click('#card-admin-management');
    I.waitForText('What is the users email address?');
    I.fillField('#search-input', TEST_EMAIL);
    I.click('Continue');
    I.waitForText('Manage ' + TEST_EMAIL);
    I.click('Change');
    I.waitForText('What role would you like ' + TEST_EMAIL + ' to have?');
    I.selectOption('updatedRole', 'CTSC Admin');
    I.click('Continue');
    I.waitForText('User Updated');

    I.click('Home');
    I.deleteAccount(TEST_EMAIL);
});

Scenario('I as an admin user should be able to see all errors related to modify a user account', async ({ I }) => {
    I.loginAsAdmin();
    I.waitForText('Your Dashboard');
    I.createAdminAccount(TEST_FIRST_NAME, TEST_LAST_NAME, TEST_EMAIL, TEST_ROLE);

    I.click('Home');
    I.see('Update and delete users.');
    I.click('#card-admin-management');
    I.waitForText('What is the users email address?');
    I.fillField('#search-input', '');
    I.click('Continue');
    I.waitForText('There is a problem');

    I.click('Home');
    I.see('Update and delete users.');
    I.click('#card-admin-management');
    I.waitForText('What is the users email address?');
    I.fillField('#search-input', TEST_INVALID_EMAIL);
    I.click('Continue');
    I.waitForText('There is a problem');

    I.click('Home');
    I.deleteAccount(TEST_EMAIL);
});
