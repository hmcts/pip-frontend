import { config as testConfig } from '../../../config';
import { randomData } from '../../shared/random-data';
import { createTestUserAccount } from '../../shared/testingSupportApi';

Feature('Manage admin user accounts');

const TEST_FIRST_NAME = testConfig.TEST_SUITE_PREFIX + 'FirstName';
const TEST_LAST_NAME = testConfig.TEST_SUITE_PREFIX + 'Surname';
const TEST_ROLE = 'INTERNAL_ADMIN_LOCAL';
const TEST_INVALID_EMAIL = 'invalid_email@justice.gov.uk';

Scenario('I as an admin user should be able to modify a user account', async ({ I }) => {
    const testEmail = randomData.getRandomEmailAddress();
    await createTestUserAccount(TEST_FIRST_NAME, TEST_LAST_NAME, testEmail, TEST_ROLE);

    I.loginAsAdmin();
    I.waitForText('Your Dashboard');
    I.click('Home');
    I.see('Update and delete users.');
    I.click('#card-admin-management');
    I.waitForText('What is the users email address?');
    I.fillField('#search-input', testEmail);
    I.click('Continue');
    I.waitForText('Manage ' + testEmail);
    I.click('Change');
    I.waitForText('What role would you like ' + testEmail + ' to have?');
    I.selectOption('updatedRole', 'CTSC Super Admin');
    I.click('Continue');
    I.waitForText('User Updated');

    I.click('Home');
    I.see('Update and delete users.');
    I.click('#card-admin-management');
    I.waitForText('What is the users email address?');
    I.fillField('#search-input', testEmail);
    I.click('Continue');
    I.waitForText('Manage ' + testEmail);
    I.click('Change');
    I.waitForText('What role would you like ' + testEmail + ' to have?');
    I.selectOption('updatedRole', 'Local Super Admin');
    I.click('Continue');
    I.waitForText('User Updated');

    I.click('Home');
    I.see('Update and delete users.');
    I.click('#card-admin-management');
    I.waitForText('What is the users email address?');
    I.fillField('#search-input', testEmail);
    I.click('Continue');
    I.waitForText('Manage ' + testEmail);
    I.click('Change');
    I.waitForText('What role would you like ' + testEmail + ' to have?');
    I.selectOption('updatedRole', 'CTSC Admin');
    I.click('Continue');
    I.waitForText('User Updated');
}).tag('@CrossBrowser');

Scenario('I as an admin user should be able to see all errors related to modify a user account', async ({ I }) => {
    I.loginAsAdmin();
    I.waitForText('Your Dashboard');

    I.click('Home');
    I.see('Update and delete users.');
    I.click('#card-admin-management');
    I.waitForText('What is the users email address?');
    I.fillField('#search-input', '');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.see('There is no user matching that email address.');

    I.click('Home');
    I.see('Update and delete users.');
    I.click('#card-admin-management');
    I.waitForText('What is the users email address?');
    I.fillField('#search-input', TEST_INVALID_EMAIL);
    I.click('Continue');
    I.waitForText('There is a problem');
    I.see('There is no user matching that email address.');
});
