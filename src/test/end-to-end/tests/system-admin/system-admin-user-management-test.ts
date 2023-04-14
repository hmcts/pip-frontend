import { config as testConfig } from '../../../config';

Feature('System admin User Management');

const testFirstName = 'System Admin Test First Name';
const testLastName = 'System Admin Test Surname';
const testEmailAddress = 'pip-e2e-test-admin-management@hmcts.net';

const systemAdminUsername = testConfig.SYSTEM_ADMIN_USERNAME as string;

Scenario('I as a system admin should be able to update a users role and delete a user', async ({ I }) => {
    I.loginAsSystemAdmin();
    I.click(locate('a').withAttr({ href: '/admin-dashboard' }));
    I.see('Your Dashboard');
    I.click('#card-create-admin-account');
    I.fillField('#firstName', testFirstName);
    I.fillField('#lastName', testLastName);
    I.fillField('#emailAddress', testEmailAddress);
    I.click('#user-role-4');
    I.click('Continue');
    I.see('Check account details');
    I.click('Confirm');
    I.see('Account has been created');

    I.click(locate('a').withAttr({ href: '/system-admin-dashboard' }));
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
}).tag('@Testing');

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
}).tag('@Testing');
