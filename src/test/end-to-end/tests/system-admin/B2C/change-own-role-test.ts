import { config as testConfig } from '../../../../config';

const systemAdminUsername = testConfig.SYSTEM_ADMIN_USERNAME as string;

Scenario('I as a system admin should not be able to change my own role', async ({ I }) => {
    I.loginAsB2CSystemAdmin();
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
