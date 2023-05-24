import { config as testConfig } from '../../../config';
import { randomData } from '../../shared/random-data';

Feature('System admin User Management');

const testFirstName = 'System Admin Test First Name';
const testLastName = 'System Admin Test Surname';

const testEmailAddress = 'pip-e2e-test-admin-management-' + randomData.getRandomNumber(1, 10000) + '@hmcts.net';
const systemAdminUsername = testConfig.SYSTEM_ADMIN_USERNAME as string;

Scenario('I as a system admin should be able to update a users role and delete a user', async ({ I }) => {
    I.loginAsSystemAdmin();
    I.click('Admin Dashboard');
    I.createAdminAccount(testFirstName, testLastName, testEmailAddress, 'Internal - Administrator - Local');
    I.click('Home');
    I.waitForText('System Admin Dashboard');
    I.click('#card-user-management');
    I.waitForText('User Management');
    I.fillField('#email', testEmailAddress);
    I.click('Apply filters');
    I.waitForText(testEmailAddress);
    I.click('#manage-link');
    I.waitForText('Manage ' + testEmailAddress);
    I.click('Change');
    I.selectOption('#updatedRole', 'CTSC Admin');
    I.click('Continue');
    I.waitForText('User Updated');
    I.waitForText('This user has been updated to a CTSC Admin');

    I.click('Home');
    I.click('#card-user-management');
    I.fillField('#email', testEmailAddress);
    I.click('Apply filters');
    I.waitForText('CTSC Admin');
    I.click('#manage-link');
    I.waitForText('CTSC Admin');

    I.click('Delete user');
    I.waitForText('Are you sure you want to delete ' + testEmailAddress + '?');
    I.click('No');
    I.click('Continue');
    I.waitForText('Manage ' + testEmailAddress);
    I.click('Delete user');
    I.click('Yes');
    I.click('Continue');
    I.waitForText('User Deleted');

    I.click('Home');
    I.click('#card-user-management');
    I.fillField('#email', testEmailAddress);
    I.click('Apply filters');
    I.waitForText('There is a problem');
    I.logout();
});

Scenario('I as a system admin should be able to filter users correctly on the User Management page', async ({ I }) => {
    I.loginAsSystemAdmin();
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
    I.logout();
});

Scenario('I as a system admin should be able to use the pagination on the user management page', async ({ I }) => {
    I.loginAsSystemAdmin();
    I.click('#card-user-management');
    I.waitForText('User Management');

    I.see('Next');
    I.see('2 of');
    I.click('.govuk-pagination__link');

    I.waitForText('Previous');
    I.see('1 of');
    I.see('Next');
    I.see('3 of');

    I.click('.govuk-pagination__link');
    I.waitForText('2 of');
    I.logout();
});

Scenario('I as a system admin should not be able to change my own role', async ({ I }) => {
    I.loginAsSystemAdmin();
    I.click('#card-user-management');
    I.waitForText('User Management');
    I.fillField('#email', systemAdminUsername);
    I.click('Apply filters');
    I.waitForText(systemAdminUsername);
    I.click('Manage');
    I.waitForText('Manage ' + systemAdminUsername);
    I.click('Change');
    I.selectOption('#updatedRole', 'Local Admin');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.see('You are unable to update the role for the same user you are logged in as');
    I.logout();
});
