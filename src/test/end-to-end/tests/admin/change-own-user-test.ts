import { config as testConfig } from '../../../config';

Feature('Admin change own user role');

Scenario('I as an admin should be able to see an error message if I try to change my own user', async ({ I }) => {
    I.loginAsAdmin();
    I.click('#card-admin-management');
    I.fillField('#search-input', secret(testConfig.ADMIN_USERNAME as string));
    I.click('Continue');
    I.click('Change');
    I.click('Continue');
    I.see('You are unable to update the role for the same user you are logged in as');
    I.logout();
})
    .tag('@Nightly')
    .tag('@CrossBrowser');
