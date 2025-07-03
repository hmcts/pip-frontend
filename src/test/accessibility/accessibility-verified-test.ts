import { randomData } from '../end-to-end/shared/random-data';
import { config as testConfig, config } from '../config';
import {
    clearTestData,
    createLocation,
    createSubscription,
    createTestUserAccount,
    uploadPublication,
} from '../end-to-end/shared/testingSupportApi';
import { DateTime } from 'luxon';

Feature('accessibility_verified_tests');
const TEST_FIRST_NAME = testConfig.TEST_SUITE_PREFIX + 'FirstName';
const TEST_LAST_NAME = testConfig.TEST_SUITE_PREFIX + 'Surname';

const caseName = 'Test Case Name';
const caseURN = 'Case URN';
const locationId = randomData.getRandomLocationId();
const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
const testUserEmail = randomData.getRandomEmailAddress();
const displayFrom = DateTime.now().toISO({ includeOffset: false });
const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });
let testUser;

BeforeSuite(async () => {
    testUser = await createTestUserAccount(TEST_FIRST_NAME, TEST_LAST_NAME, testUserEmail);
    await createLocation(locationId, locationName);
    await uploadPublication(
        'PUBLIC',
        locationId,
        displayFrom,
        displayFrom,
        displayTo,
        'ENGLISH',
        'etDailyList.json',
        'ET_DAILY_LIST'
    );
    await createSubscription(locationId, locationName, testUser['userId'] as string);
});

Before(({ I }) => {
    I.loginTestMediaUser(testUser['email'], secret(testConfig.TEST_USER_PASSWORD));
    I.waitForText('Your account');
});

Scenario('Verified User Journey - account-home-page', async ({ I }) => {
    I.amOnPage('/account-home');
    I.checkA11y('account-home-a11y-audit.html');
});

Scenario('Verified User Journey - subscription-management-page', async ({ I }) => {
    I.amOnPage('/subscription-management');
    I.checkA11y('subscription-management-a11y-audit.html');
});

Scenario('Verified User Journey - subscription-add-page', async ({ I }) => {
    I.amOnPage('/subscription-add');
    I.checkA11y('subscription-add-a11y-audit.html');
});

Scenario('Verified User Journey - location-name-search-page', async ({ I }) => {
    I.amOnPage('/location-name-search');
    I.checkA11y('location-name-search-a11y-audit.html');
});

Scenario('Verified User Journey - location-name-search-error-page', async ({ I }) => {
    I.amOnPage('/location-name-search');
    I.waitForText('Subscribe by court or tribunal name');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.checkA11y('location-name-search-error-a11y-audit.html');
});

Scenario('Verified User Journey - pending-subscriptions-page', async ({ I }) => {
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Add email subscription');
    I.waitForText('How do you want to add an email subscription?');
    I.click('#subscription-choice-1');
    I.click('Continue');
    I.checkOption('//*[@id="' + locationId + '"]');
    I.click('Continue');
    I.waitForText('Your email subscriptions');
    I.checkA11y('pending-subscriptions-a11y-audit.html');
});

Scenario('Verified User Journey - subscription-add-list-page', async ({ I }) => {
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Add email subscription');
    I.waitForText('How do you want to add an email subscription?');
    I.click('#subscription-choice-1');
    I.click('Continue');
    I.checkOption('//*[@id="' + locationId + '"]');
    I.click('Continue');
    I.waitForText('Your email subscriptions');
    I.see(locationName);
    I.click('Continue');
    I.waitForText('Select List Types');
    I.checkA11y('subscription-add-list-a11y-audit.html');
});

Scenario('Verified User Journey - subscription-add-list-error-page', async ({ I }) => {
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Add email subscription');
    I.waitForText('How do you want to add an email subscription?');
    I.click('#subscription-choice-1');
    I.click('Continue');
    I.checkOption('//*[@id="' + locationId + '"]');
    I.click('Continue');
    I.waitForText('Your email subscriptions');
    I.click('Continue');
    I.waitForText('Select List Types');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.checkA11y('subscription-add-list-error-a11y-audit.html');
});
Scenario('Verified User Journey - subscription-add-list-language-page', async ({ I }) => {
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Add email subscription');
    I.waitForText('How do you want to add an email subscription?');
    I.click('#subscription-choice-1');
    I.click('Continue');
    I.checkOption('//*[@id="' + locationId + '"]');
    I.click('Continue');
    I.waitForText('Your email subscriptions');
    I.see(locationName);
    I.click('Continue');
    I.waitForText('Select List Types');
    I.checkOption('#ET_DAILY_LIST');
    I.click('Continue');
    I.waitForText('What version of the list do you want to receive?');
    I.checkA11y('subscription-add-list-language-a11y-audit.html');
});

Scenario('Verified User Journey - subscription-add-list-language-error-page', async ({ I }) => {
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Add email subscription');
    I.waitForText('How do you want to add an email subscription?');
    I.click('#subscription-choice-1');
    I.click('Continue');
    I.checkOption('//*[@id="' + locationId + '"]');
    I.click('Continue');
    I.waitForText('Your email subscriptions');
    I.see(locationName);
    I.click('Continue');
    I.waitForText('Select List Types');
    I.checkOption('#ET_DAILY_LIST');
    I.click('Continue');
    I.waitForText('What version of the list do you want to receive?');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.checkA11y('subscription-add-list-language-error-a11y-audit.html');
});

Scenario('Verified User Journey - subscription-confirmation-preview-list-language-page', async ({ I }) => {
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Add email subscription');
    I.waitForText('How do you want to add an email subscription?');
    I.click('#subscription-choice-1');
    I.click('Continue');
    I.checkOption('//*[@id="' + locationId + '"]');
    I.click('Continue');
    I.waitForText('Your email subscriptions');
    I.see(locationName);
    I.click('Continue');
    I.waitForText('Select List Types');
    I.checkOption('#ET_DAILY_LIST');
    I.click('Continue');
    I.waitForText('What version of the list do you want to receive?');
    I.click('#english');
    I.click('Continue');
    I.waitForText('Confirm your email subscriptions');
    I.checkA11y('subscription-confirmation-preview-a11y-audit.html');
});

Scenario('Verified User Journey - subscription-confirmed-page', async ({ I }) => {
    I.amOnPage('/subscription-confirmed');
    I.checkA11y('subscription-confirmed-a11y-audit.html');
});

Scenario('Verified User Journey - subscription-confirmed-page', async ({ I }) => {
    I.amOnPage('/subscription-confirmed');
    I.checkA11y('subscription-confirmed-a11y-audit.html');
});

Scenario('Verified User Journey - case-name-search-page', async ({ I }) => {
    I.amOnPage('/case-name-search');
    I.checkA11y('case-name-search-a11y-audit.html');
});

Scenario('Verified User Journey - case-name-search-results-page', async ({ I }) => {
    I.amOnPage('/case-name-search');
    I.waitForText('What is the name of the case?');
    I.fillField('#case-name', caseName);
    I.click('Continue');
    I.waitForText('Search result');
    I.checkA11y('case-name-search-results-a11y-audit.html');
});

Scenario('Verified User Journey - case-name-search-error-page', async ({ I }) => {
    I.amOnPage('/case-name-search');
    I.waitForText('What is the name of the case?');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.checkA11y('case-name-search-error-a11y-audit.html');
});

Scenario('Verified User Journey - case-reference-number-search-page', async ({ I }) => {
    I.amOnPage('/case-reference-number-search');
    I.checkA11y('case-reference-number-search-a11y-audit.html');
});

Scenario('Verified User Journey - case-reference-number-search-results-page', async ({ I }) => {
    I.amOnPage('/case-reference-number-search');
    I.waitForText('What is the reference number?');
    I.fillField('#search-input', caseURN);
    I.click('Continue');
    I.waitForText('Search result');
    I.checkA11y('case-reference-number-search-results-a11y-audit.html');
});

Scenario('Verified User Journey - case-reference-number-search-error-page', async ({ I }) => {
    I.amOnPage('/case-reference-number-search');
    I.waitForText('What is the reference number?');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.checkA11y('case-reference-number-search-error-a11y-audit.html');
});

Scenario('Verified User Journey - bulk-unsubscribe-page', async ({ I }) => {
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('#bulk-unsubscribe-button');
    I.waitForText('Bulk unsubscribe');
    I.checkA11y('bulk-unsubscribe-a11y-audit.html');
});

Scenario('Verified User Journey - bulk-unsubscribe-confirm-page', async ({ I }) => {
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('#bulk-unsubscribe-button');
    I.waitForText('Bulk unsubscribe');
    I.click(locate('//tr').withText(locationName).find('input').withAttr({ name: 'courtSubscription' }));
    I.click('#bulk-unsubscribe-button');
    I.waitForText('Are you sure you want to remove these subscriptions?');
    I.checkA11y('bulk-unsubscribe-confirm-a11y-audit.html');
});

Scenario('Verified User Journey - subscription-configure-list-page', async ({ I }) => {
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Edit list types');
    I.waitForText('Select List Types');
    I.checkA11y('subscription-configure-list-a11y-audit.html');
});

Scenario('Verified User Journey - subscription-configure-list-error-page', async ({ I }) => {
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Edit list types');
    I.waitForText('Select List Types');
    I.click('Continue');
    I.waitForText('Please select a list type to continue');
    I.checkA11y('subscription-configure-list-error-a11y-audit.html');
});

Scenario('Verified User Journey - subscription-configure-list-language-page', async ({ I }) => {
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Edit list types');
    I.waitForText('Select List Types');
    I.checkOption('#ET_DAILY_LIST');
    I.click('Continue');
    I.waitForText('What version of the list do you want to receive?');
    I.checkA11y('subscription-configure-list-language-a11y-audit.html');
});

Scenario('Verified User Journey - subscription-configure-list-confirmed-page', async ({ I }) => {
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Edit list types');
    I.waitForText('Select List Types');
    I.checkOption('#ET_DAILY_LIST');
    I.click('Continue');
    I.waitForText('What version of the list do you want to receive?');
    I.click('#english');
    I.click('Continue');
    I.waitForText('Confirm your email subscriptions');
    I.click('Confirm Subscriptions');
    I.waitForText('List types updated');
    I.checkA11y('subscription-configure-list-confirmed-a11y-audit.html');
});

Scenario('Verified User Journey - delete-subscription-page', async ({ I }) => {
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Email subscriptions');
    I.click(locate('//tr').withText(locationName).find('a').withText('Unsubscribe'));
    I.waitForText('Are you sure you want to remove this subscription?');

    I.checkA11y('delete-subscription-a11y-audit.html');
});

Scenario('Verified User Journey - unsubscribe-confirmation-page', async ({ I }) => {
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Email subscriptions');
    I.click(locate('//tr').withText(locationName).find('a').withText('Unsubscribe'));
    I.waitForText('Are you sure you want to remove this subscription?');
    I.click('#unsubscribe-confirm');
    I.click('Continue');
    I.waitForText('Your subscription has been removed');
    I.checkA11y('unsubscribe-confirmation-a11y-audit.html');
});

AfterSuite(async () => {
    await clearTestData();
});
