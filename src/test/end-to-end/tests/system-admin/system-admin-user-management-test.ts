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
    I.see('System Admin Dashboard');
    I.click('#card-user-management');
    I.see('User Management');
    I.fillField('#email', testEmailAddress);
    I.click('Apply filters');
    I.see(testEmailAddress);
    I.click('#manage-link');
    I.see('Manage ' + testEmailAddress);
    I.click('Change');
    I.selectOption('#updatedRole', 'CTSC Admin');
    I.click('Continue');
    I.see('User Updated');
    I.see('This user has been updated to a CTSC Admin');

    I.click('Home');
    I.click('#card-user-management');
    I.fillField('#email', testEmailAddress);
    I.click('Apply filters');
    I.see('CTSC Admin');
    I.click('#manage-link');
    I.see('CTSC Admin');

    I.click('Delete user');
    I.see('Are you sure you want to delete ' + testEmailAddress + '?');
    I.click('No');
    I.click('Continue');
    I.see('Manage ' + testEmailAddress);
    I.click('Delete user');
    I.click('Yes');
    I.click('Continue');
    I.see('User Deleted');

    I.click('Home');
    I.click('#card-user-management');
    I.fillField('#email', testEmailAddress);
    I.click('Apply filters');
    I.see('There is a problem');
});

Scenario('I as a system admin should be able to filter users correctly on the User Management page', async ({ I }) => {
    I.loginAsSystemAdmin();
    I.click('#card-user-management');
    I.see('User Management');

    I.fillField('#email', systemAdminUsername);
    I.click('Apply filters');
    I.see(systemAdminUsername);
    I.seeNumberOfElements('.govuk-table__body .govuk-table__row', 1);
    I.click('Manage');

    const userId = (await I.grabTextFrom(locate('.govuk-summary-list__value').first())).trim();
    const provenanceId = (await I.grabTextFrom(locate('.govuk-summary-list__value').at(5))).trim();

    I.click('Back');
    I.see('User Management');
    I.click('Clear filters');
    I.fillField('#userId', userId);
    I.click('Apply filters');
    I.see(systemAdminUsername);
    I.seeNumberOfElements('.govuk-table__body .govuk-table__row', 1);
    I.click('Clear filters');

    I.fillField('#userProvenanceId', provenanceId);
    I.click('Apply filters');
    I.see(systemAdminUsername);
    I.seeNumberOfElements('.govuk-table__body .govuk-table__row', 1);
    I.click('Clear filters');

    I.click('System Admin');
    I.click('Apply filters');
    I.see(systemAdminUsername);
    I.click('Clear filters');

    I.click('B2C');
    I.click('Apply filters');
    I.see(systemAdminUsername);
    I.click('Clear filters');

    I.click('CFT IdAM');
    I.click('Apply filters');
    I.dontSee(systemAdminUsername);
    I.click('.moj-filter__tag');
    I.see(systemAdminUsername);
});

Scenario('I as a system admin should not be able to change my own role', async ({ I }) => {
    I.loginAsSystemAdmin();
    I.click('#card-user-management');
    I.see('User Management');
    I.fillField('#email', systemAdminUsername);
    I.click('Apply filters');
    I.see(systemAdminUsername);
    I.click('Manage');
    I.see('Manage ' + systemAdminUsername);
    I.click('Change');
    I.selectOption('#updatedRole', 'Local Admin');
    I.click('Continue');
    I.see('There is a problem');
    I.see('You are unable to update the role for the same user you are logged in as');
});
