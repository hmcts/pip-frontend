import { randomData } from '../../shared/random-data';
import { config as testConfig } from '../../../config';


Feature('System admin - third-party subscribers');

Scenario("I can manage all third party subscribers", async ({I}) => {
        I.loginAsSsoSystemAdmin();
        I.see('View, create, update and remove third-party subscribers');
        I.click('#card-manage-third-party-subscribers');
        I.waitForText('Manage third party subscribers');
        I.see('Name');
        I.see('Created Date');
        I.logoutSsoSystemAdmin()
    });

Scenario("I can create a third party subscriber", async ({I}) => {
    const testName = testConfig.TEST_SUITE_PREFIX + randomData.getRandomString();
    I.loginAsSsoSystemAdmin();
    I.see('View, create, update and remove third-party subscribers');
    I.click('#card-manage-third-party-subscribers');
    I.waitForText('Manage third party subscribers');
    I.click('#create-subscriber');
    I.waitForText('Create third party subscriber');
    I.fillField('#subscriberName', testName);
    I.click('Continue');
    I.waitForText('Create third party subscriber summary');
    I.see(testName);
    I.click('Confirm');
    I.waitForText('Third party subscriber created');
    I.see('The third party subscriber has been successfully created.');
    I.see('What do you want to do next?');
    I.logoutSsoSystemAdmin()
});

    Scenario("I can manage a third party subscriber", async ({I}) => {
        const testName = testConfig.TEST_SUITE_PREFIX + randomData.getRandomString();
        I.loginAsSsoSystemAdmin();
        I.see('View, create, update and remove third-party subscribers');
        I.click('#card-manage-third-party-subscribers');
        I.waitForText('Manage third party subscribers');
        I.see('Name');
        I.see('Created Date');
        I.click(locate('//tr').withText(testName).find('a').withText('Manage'));
        I.waitForText('Manage subscriber');
        I.logoutSsoSystemAdmin()
    });

    Scenario("I can delete a third party subscriber", async ({I}) => {
        const testName = testConfig.TEST_SUITE_PREFIX + randomData.getRandomString();
        I.loginAsSsoSystemAdmin();
        I.click(locate('//li').withText('Dashboard'));
        I.waitForText('System Admin Dashboard');
        I.click('#card-manage-third-party-subscribers');
        I.waitForText('Manage third party subscribers');
        I.see(testName);
        I.click(locate('//tr').withText(testName).find('a').withText('Manage'));
        I.waitForText('Manage subscriber');
        I.see(testName);
        I.click('Delete subscriber');
        I.waitForText('Are you sure you want to delete ' + testName + '?');
        I.click('#delete-subscriber-confirm');
        I.click('Continue');
        I.waitForText('Third party subscriber deleted');
        I.see('The third party subscriber, associated subscriptions and Oauth configuration have been removed.');
        I.see('What do you want to do next?');
        I.logoutSsoSystemAdmin()
    });

