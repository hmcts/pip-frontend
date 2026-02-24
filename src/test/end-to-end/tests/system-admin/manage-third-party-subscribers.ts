import { randomData } from '../../shared/random-data';
import { config as testConfig } from '../../../config';
import { createThirdPartyApiUser } from '../../shared/testingSupportApi';

Feature('System admin - third-party subscribers');

const DESTINATION_URL = 'https://example.com/callback';
const SCOPE_VALUE = 'scopeValue';
const TOKEN_URL = 'https://example.com/token';
const CLIENT_ID = 'clientId';
const CLIENT_SECRET = 'clientSecret';

Scenario('I can create, View, update and remove third party subscribers', async ({ I }) => {
    const testName = testConfig.TEST_SUITE_PREFIX + randomData.getRandomString();
    I.loginAsSsoSystemAdmin();
    I.see('View, update and remove third party subscribers');
    I.click('#card-manage-third-party-subscribers');
    I.waitForText('Manage third party subscribers');
    I.click('#create-subscriber');
    I.waitForText('Create third party subscriber');
    I.fillField('#thirdPartySubscriberName', testName);
    I.click('Continue');
    I.waitForText('Create third party subscriber summary');
    I.see(testName);
    I.click('Change');
    I.waitForText('Create third party subscriber');
    I.click('Continue');
    I.waitForText('Create third party subscriber summary');
    I.click('Confirm');
    I.waitForText('Third party subscriber created');
    I.see('What do you want to do next?');

    I.click('Manage third party subscriber');
    I.waitForText('Manage third party subscribers');
    I.see('Name');
    I.see('Created Date');
    I.see(testName);
    I.click(locate('//tr').withText(testName).find('a').withText('Manage'));
    I.waitForText('Manage subscriber');
    I.see('Name');
    I.see('Created Date');
    I.click('#manage-subscriptions');
    I.waitForText('Manage third-party subscriptions');
    I.see('Civil and Family Daily Cause List');
    I.selectOption('#CIVIL_AND_FAMILY_DAILY_CAUSE_LIST', 'Private');
    I.click('Create');
    I.waitForText('Confirm third-party subscriptions');
    I.see('Civil and Family Daily Cause List');
    I.see('Private');
    I.click('Confirm');
    I.waitForText('Third-party subscriptions created');

    I.click('Manage third-party subscribers');
    I.waitForText('Manage third party subscribers');
    I.click(locate('//tr').withText(testName).find('a').withText('Manage'));
    I.waitForText('Manage subscriber');
    I.click('#manage-subscriber-oauth-configuration');
    I.waitForText('Manage third party subscriber Oauth Configuration');
    I.fillField('#destinationUrl', DESTINATION_URL);
    I.fillField('#tokenUrl', TOKEN_URL);
    I.fillField('#scopeValue', SCOPE_VALUE);
    I.fillField('#clientId', CLIENT_ID);
    I.fillField('#clientSecret', CLIENT_SECRET);
    I.click('Create');
    I.waitForText('Manage third party subscriber oauth config summary');
    I.see(DESTINATION_URL);
    I.see(TOKEN_URL);
    I.see(SCOPE_VALUE);
    I.see(CLIENT_ID);
    I.click('#button');
    I.waitForText('Third party subscriber oauth config updated');

    I.click('Manage third party subscriber');
    I.waitForText('Manage third party subscribers');
    I.click(locate('//tr').withText(testName).find('a').withText('Manage'));
    I.waitForText('Manage subscriber');
    I.click('Delete subscriber');
    I.see(testName);
    I.waitForText('Are you sure you want to delete ' + testName + '?');
    I.click('#delete-subscriber-confirm');
    I.click('Continue');
    I.waitForText('Third party subscriber deleted');
    I.see('The third party subscriber, associated subscriptions and Oauth configuration have been removed.');
    I.see('What do you want to do next?');
    I.logoutSsoSystemAdmin();
});

Scenario(
    'I should be able to see proper information texts and error messages related to third party user',
    async ({ I }) => {
        const testUserName = testConfig.TEST_SUITE_PREFIX + randomData.getRandomString();
        const thirdPartyUserId = await createThirdPartyApiUser(testUserName);

        I.loginAsSsoSystemAdmin();
        I.click('#card-manage-third-party-subscribers');
        I.waitForText('Manage third party subscribers');
        I.click('#create-subscriber');
        I.waitForText('Create third party subscriber');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('Enter name');

        I.amOnPage('/manage-third-party-subscriptions?userId=' + thirdPartyUserId);
        I.waitForText('Manage third-party subscriptions');
        I.click('Create');
        I.waitForText('There is a problem');
        I.see('At least one list type must be selected to create new subscription.');

        I.amOnPage('/manage-third-party-subscriber-oauth-config?userId=' + thirdPartyUserId);
        I.waitForText('Manage third party subscriber Oauth Configuration');
        I.click('Create');
        I.waitForText('There is a problem');
        I.see('Enter Destination URL');
        I.see('Enter Token URL');
        I.see('Enter Scope Value');
        I.see('Enter Client ID');
        I.see('Enter Client Secret');
    }
);
