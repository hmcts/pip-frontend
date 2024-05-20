import { createThirdPartyUserAccount } from '../../shared/testingSupportApi';
import { randomData } from '../../shared/random-data';
import { config as testConfig } from '../../../config';

Feature('System admin manage Third-Party Users');

Scenario('I as a system admin should be able to manage Third-Party Users', async ({ I }) => {
    const testProvenanceUserId = testConfig.TEST_SUITE_PREFIX + randomData.getRandomString();
    const userId = await createThirdPartyUserAccount(testProvenanceUserId);

    I.loginAsSystemAdmin();
    I.waitForText('View, create, update and remove third-party users and subscriptions');
    I.click('#card-manage-third-party-users');
    I.waitForText('Manage third party users');
    I.see('Name');
    I.see('Role');
    I.see('Created Date');
    I.see(testProvenanceUserId);
    I.see('GENERAL_THIRD_PARTY');
    I.click(locate('//tr').withText(testProvenanceUserId).find('a').withText('Manage'));
    I.waitForText('Manage user');
    I.see(testProvenanceUserId);
    I.see('GENERAL_THIRD_PARTY');
    I.see('N/A - No subscriptions');
    I.click('#approve');
    I.waitForText('Manage third party subscriptions');
    I.see('Please select a Channel');
    I.see('Please select list types');
    I.click('Save subscriptions');
    I.waitForText('Third Party Subscriptions Updated');
    I.see('Third party subscriptions for the user have been successfully updated');
    I.deleteThirdPartyUserAccount(userId);
});

Scenario('I as a system admin should be able to create and delete third party users', async ({ I }) => {
    const testName = testConfig.TEST_SUITE_PREFIX + randomData.getRandomString();

    I.loginAsSystemAdmin();
    I.click('#card-manage-third-party-users');
    I.waitForText('Manage third party users');
    I.click('#create-user');
    I.waitForText("Create third party user");
    I.click('#thirdPartyName');
    I.fillField('#thirdPartyName',testName);
    I.click('#thirdPartyRole');
    I.click('Continue');
    I.waitForText('Check user details');
    I.see(testName);
    I.see('General third party');
    I.click(locate('//div').withText('General third party').find('a').withText('Change'));
    I.waitForText("Create third party user");
    I.click('#thirdPartyRole-8');
    I.click('Continue');
    I.waitForText('Check user details');
    I.see(testName);
    I.see('Verified third party - All');
    I.click('Confirm');
    I.waitForText('Third party user has been created');

    I.click(locate('//li').withText('Home'));
    I.waitForText("System Admin Dashboard");
    I.click('#card-manage-third-party-users');
    I.waitForText('Manage third party users');
    I.see(testName);
    I.click(locate('//tr').withText(testName).find('a').withText('Manage'));
    I.waitForText('Manage user');
    I.see(testName);
    I.see('VERIFIED_THIRD_PARTY_ALL');
    I.click('Delete user');
    I.waitForText('Are you sure you want to delete '+testName+'?');
    I.click('#delete-user-confirm');
    I.click('Continue');
    I.waitForText('Success');
    I.see('The third party user and associated subscriptions have been removed.');
    I.see('What do you want to do next?');

    I.click('Manage another third party user');
    I.waitForText('Manage third party users');
    I.dontSee(testName);
});

Scenario('Third party user management show proper error messages', async ({ I }) => {
    const testName = testConfig.TEST_SUITE_PREFIX + randomData.getRandomString();

    I.loginAsSystemAdmin();
    I.click('#card-manage-third-party-users');
    I.waitForText('Manage third party users');
    I.click('#create-user');
    I.waitForText("Create third party user");
    I.click('Continue');
    I.waitForText('There is a problem');
    I.see('Enter name');
    I.see('Select a role');

    I.fillField('#thirdPartyName',testName);
    I.click('#thirdPartyRole');
    I.click('Continue');
    I.waitForText('Check user details');
    I.click('Confirm');
    I.waitForText('Third party user has been created');

    I.click(locate('//li').withText('Home'));
    I.waitForText("System Admin Dashboard");
    I.click('#card-manage-third-party-users');
    I.waitForText('Manage third party users');
    I.click('#create-user');
    I.waitForText("Create third party user");
    I.fillField('#thirdPartyName',testName);
    I.click('#thirdPartyRole');
    I.click('Continue');
    I.waitForText('Check user details');
    I.click('Confirm');
    I.waitForText('There is a problem');
    I.see('Failed to create third party user. It is possible that the user already exists.');

    I.click(locate('//li').withText('Home'));
    I.waitForText("System Admin Dashboard");
    I.click('#card-manage-third-party-users');
    I.waitForText('Manage third party users');
    I.see(testName);
    I.click(locate('//tr').withText(testName).find('a').withText('Manage'));
    I.waitForText('Manage user');
    I.see(testName);
    I.click('Delete user');
    I.waitForText('Are you sure you want to delete '+testName+'?');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.waitForText('An option must be selected');

    I.click('#delete-user-confirm');
    I.click('Continue');
    I.waitForText('Success');
});


