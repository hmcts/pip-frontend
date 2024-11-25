import { config as testConfig } from '../../../config';
import { randomData } from '../../shared/random-data';
import { createTestUserAccount } from '../../shared/testingSupportApi';

Feature('System admin User Management');

const TEST_FIRST_NAME = testConfig.TEST_SUITE_PREFIX + 'FirstName';
const TEST_LAST_NAME = testConfig.TEST_SUITE_PREFIX + 'Surname';
const TEST_ROLE = 'INTERNAL_ADMIN_LOCAL';

const systemAdminUsername = testConfig.SSO_TEST_SYSTEM_ADMIN_USER as string;

Scenario('I as a system admin should be able to delete a user', async ({ I }) => {
    const testEmail = randomData.getRandomEmailAddress();
    await createTestUserAccount(TEST_FIRST_NAME, TEST_LAST_NAME, testEmail, TEST_ROLE);

    I.loginAsSsoSystemAdmin();
    I.click('Admin Dashboard');
    I.click('Dashboard');
    I.waitForText('System Admin Dashboard');
    I.click('#card-user-management');
    I.waitForText('User Management');
    I.fillField('#email', testEmail);
    I.click('Apply filters');
    I.waitForText(testEmail);
    I.click('#manage-link');
    I.waitForText('Manage ' + testEmail);
    I.waitForText('Local Admin');

    I.click('Delete user');
    I.waitForText('Are you sure you want to delete ' + testEmail + '?');
    I.click('No');
    I.click('Continue');
    I.waitForText('Manage ' + testEmail);
    I.click('Delete user');
    I.click('Yes');
    I.click('Continue');
    I.waitForText('User Deleted');

    I.click('Dashboard');
    I.click('#card-user-management');
    I.fillField('#email', testEmail);
    I.click('Apply filters');
    I.waitForText('There is a problem');
    I.logoutSsoSystemAdmin();
});

Scenario('I as a system admin should be able to filter users correctly on the User Management page', async ({ I }) => {
    I.loginAsSsoSystemAdmin();
    I.click('#card-user-management');
    I.waitForText('User Management');

    I.fillField('#email', systemAdminUsername);
    I.click('Apply filters');
    I.waitForText(systemAdminUsername);
    I.seeNumberOfElements('.govuk-table__body .govuk-table__row', 1);
    I.click('Manage');

    const userId = (await I.grabTextFrom(locate('.govuk-summary-list__value').first())).trim();
    const provenanceId = (await I.grabTextFrom(locate('.govuk-summary-list__value').at(5))).trim();

    I.click('Back');
    I.waitForText('User Management');
    I.click('Clear filters');
    I.fillField('#userId', userId);
    I.click('Apply filters');
    I.waitForText(systemAdminUsername);
    I.seeNumberOfElements('.govuk-table__body .govuk-table__row', 1);
    I.click('Clear filters');

    I.fillField('#userProvenanceId', provenanceId);
    I.click('Apply filters');
    I.waitForText(systemAdminUsername);
    I.seeNumberOfElements('.govuk-table__body .govuk-table__row', 1);
    I.click('Clear filters');

    I.click('System Admin');
    I.click('Apply filters');
    I.waitForText(systemAdminUsername);
    I.click('Clear filters');

    I.click('B2C');
    I.fillField('#userId', userId);
    I.click('Apply filters');
    I.waitForText(systemAdminUsername);
    I.click('Clear filters');

    I.click('CFT IdAM');
    I.click('Apply filters');
    I.dontSee(systemAdminUsername);
    I.click(locate('.moj-filter__tag').at(1));
    I.fillField('#userId', userId);
    I.click('Apply filters');
    I.waitForText(systemAdminUsername);
    I.logoutSsoSystemAdmin();
});

Scenario('I as a system admin should be able to use the pagination on the user management page', async ({ I }) => {
    I.loginAsSsoSystemAdmin();
    I.click('#card-user-management');
    I.waitForText('User Management');

    I.see('Next');
    I.see('2 of');
    I.click('.govuk-pagination__link');

    I.waitForText('Previous');
    I.see('1 of');

    I.click('.govuk-pagination__link');
    I.waitForText('2 of');
    I.logoutSsoSystemAdmin();
});
