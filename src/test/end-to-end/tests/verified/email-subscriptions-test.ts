import { DateTime } from 'luxon';
import { createLocation, createTestUserAccount, uploadPublication } from '../../shared/testingSupportApi';
import { randomData } from '../../shared/random-data';
import { config as testConfig, config } from '../../../config';

Feature('Verified user email subscriptions');

const TEST_FIRST_NAME = testConfig.TEST_SUITE_PREFIX + 'FirstName';
const TEST_LAST_NAME = testConfig.TEST_SUITE_PREFIX + 'Surname';

const caseId = '12341234';
const caseName = 'Test Case Name';
const caseURN = 'Case URN';
const caseNameNumber = '12341232';
const caseNameUrn = '18472381412';
const caseNamePartyFullName = 'Test Forename Test Surname';
const caseNamePartyOrganisationName = 'Test Organisation Name';
const caseNamePartyRepSurname = 'Test Rep Surname';

const displayFrom = DateTime.now().toISO({ includeOffset: false });
const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });

Scenario(
    'I as a verified user should be able to subscribe by court name, URN, case id and case name. Also ' +
        'should be able to remove subscription and bulk unsubscribe',
    async ({ I }) => {
        const locationId = randomData.getRandomLocationId();
        const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
        const testUserEmail = randomData.getRandomEmailAddress();

        const testUser = await createTestUserAccount(TEST_FIRST_NAME, TEST_LAST_NAME, testUserEmail);
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

        I.loginTestMediaUser(testUser['email'], secret(testConfig.TEST_USER_PASSWORD));
        I.click('#card-subscription-management');
        I.waitForText('Your email subscriptions');
        I.click('Add email subscription');
        I.waitForText('How do you want to add an email subscription?');
        I.see('You can only search for information that is currently published.');
        I.click('#subscription-choice-1');
        I.click('Continue');
        I.checkOption('//*[@id="' + locationId + '"]');
        I.click('Continue');
        I.click('Confirm Subscriptions');
        I.waitForText('Email subscriptions updated');

        I.click('Email subscriptions');
        I.click('Add email subscription');
        I.click('#subscription-choice-3');
        I.click('Continue');
        I.waitForText('What is the reference number?');
        I.see(
            'Please enter either a case reference number, case ID or unique reference number (URN). You must enter an exact match.'
        );
        I.fillField('#search-input', caseId);
        I.click('Continue');
        I.waitForText('Search result');
        I.see('1 found');
        I.see(caseId);
        I.click('Continue');
        I.waitForText('Confirm your email subscriptions');
        I.click('Confirm Subscriptions');
        I.waitForText('Email subscriptions updated');

        I.click('Email subscriptions');
        I.click('Add email subscription');
        I.click('#subscription-choice-3');
        I.click('Continue');
        I.waitForText('What is the reference number?');
        I.see(
            'Please enter either a case reference number, case ID or unique reference number (URN). You must enter an exact match.'
        );
        I.fillField('#search-input', caseURN);
        I.click('Continue');
        I.waitForText('Search result');
        I.see('1 found');
        I.see(caseURN);
        I.click('Continue');
        I.waitForText('Confirm your email subscriptions');
        I.click('Confirm Subscriptions');
        I.waitForText('Email subscriptions updated');

        I.click('Email subscriptions');
        I.click('Add email subscription');
        I.click('#subscription-choice-2');
        I.click('Continue');
        I.waitForText('What is the name of the case?');
        I.see('For example, Smith');
        I.fillField('#case-name', caseName);
        I.click('Continue');
        I.waitForText('Search result');
        I.see(caseName);
        I.see(caseNamePartyFullName);
        I.see(caseNamePartyOrganisationName);
        I.see(caseNameNumber);
        I.see(caseNameUrn);
        I.dontSee(caseNamePartyRepSurname);
        I.checkOption('//*[@id="12341232"]');
        I.checkOption('//*[@id="18472381412"]');
        I.click('Continue');
        I.waitForText('Confirm your email subscriptions');
        I.click('Confirm Subscriptions');
        I.waitForText('Email subscriptions updated');

        I.click('Email subscriptions');
        I.waitForText('All subscriptions');
        I.see(locationName);
        I.see(caseId);
        I.see(caseName);
        I.see(caseURN);
        I.see(caseNameNumber);
        I.see(caseNameUrn);
        I.see(caseNamePartyFullName);
        I.see(caseNamePartyOrganisationName);

        I.click('Subscriptions by case');
        I.dontSee(locationName);
        I.see(caseId);
        I.see(caseName);
        I.see(caseURN);
        I.see(caseNameNumber);
        I.see(caseNameUrn);
        I.see(caseNamePartyFullName);
        I.see(caseNamePartyOrganisationName);

        I.click('Subscriptions by court or tribunal');
        I.see(locationName);
        I.dontSee(caseId);
        I.dontSee(caseName);
        I.dontSee(caseURN);

        I.click('All subscriptions');
        I.see(caseURN);
        I.click(locate('//tr').withText(caseURN).find('a').withText('Unsubscribe'));

        I.waitForText('Are you sure you want to remove this subscription?');
        I.click('#unsubscribe-confirm');
        I.click('Continue');
        I.waitForText('Your subscription has been removed');

        I.click('Email subscriptions');
        I.click('#bulk-unsubscribe-button');

        I.click(locate('//tr').withText(caseName).find('input').withAttr({ name: 'caseSubscription' }));
        I.click(locate('//tr').withText(locationName).find('input').withAttr({ name: 'courtSubscription' }));
        I.click(locate('//tr').withText(caseId).find('input').withAttr({ name: 'caseSubscription' }));
        I.click(locate('//tr').withText(caseNameUrn).find('input').withAttr({ name: 'caseSubscription' }));

        I.click('#bulk-unsubscribe-button');
        I.waitForText('Are you sure you want to remove these subscriptions?');
        I.click('#bulk-unsubscribe-choice');
        I.click('Continue');
        I.waitForText('Email subscriptions updated');
        I.logout();
    }
).tag('@CrossBrowser');

Scenario('I as a verified user should be able to select all subscriptions when bulk unsubscribing', async ({ I }) => {
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
    const testUserEmail = randomData.getRandomEmailAddress();

    const testUser = await createTestUserAccount(TEST_FIRST_NAME, TEST_LAST_NAME, testUserEmail);
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

    I.loginTestMediaUser(testUser['email'], secret(testConfig.TEST_USER_PASSWORD));
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Add email subscription');
    I.waitForText('How do you want to add an email subscription?');
    I.click('#subscription-choice-1');
    I.click('Continue');
    I.checkOption('//*[@id="' + locationId + '"]');
    I.click('Continue');
    I.click('Confirm Subscriptions');
    I.waitForText('Email subscriptions updated');

    I.click('Email subscriptions');
    I.waitForText('Your email subscriptions');
    I.click('Add email subscription');
    I.click('#subscription-choice-3');
    I.click('Continue');
    I.waitForText('What is the reference number?');
    I.see(
        'Please enter either a case reference number, case ID or unique reference number (URN). You must enter an exact match.'
    );
    I.fillField('#search-input', caseId);
    I.click('Continue');
    I.waitForText('Search result');
    I.see('1 found');
    I.see(caseId);
    I.click('Continue');
    I.waitForText('Confirm your email subscriptions');
    I.click('Confirm Subscriptions');
    I.waitForText('Email subscriptions updated');

    I.click('Email subscriptions');
    I.waitForText('Your email subscriptions');
    I.see(locationName);
    I.see(caseId);

    I.click('Email subscriptions');
    I.waitForText('Your email subscriptions');
    I.click('#bulk-unsubscribe-button');
    I.waitForText('Bulk unsubscribe');
    I.see('All subscriptions (2)');
    I.see('Subscriptions by case (1)');
    I.see('Subscriptions by court or tribunal (1)');

    I.click('Subscriptions by case');
    I.seeElementInDOM('#select-all-cases');
    I.dontSeeElementInDOM('#select-all-locations');

    I.click('Subscriptions by court or tribunal');
    I.dontSeeElementInDOM('#select-all-cases');
    I.seeElementInDOM('#select-all-locations');

    I.click('All subscriptions');
    I.seeElementInDOM('#select-all-cases');
    I.seeElementInDOM('#select-all-locations');

    I.click('#select-all-cases');
    I.click('#select-all-locations');
    I.click('#select-all-cases');
    I.click('#select-all-locations');
    I.click('#bulk-unsubscribe-button');
    I.waitForText('There is a problem');
    I.see('At least one subscription must be selected');

    I.click('#select-all-cases');
    I.click('#select-all-locations');
    I.click('#bulk-unsubscribe-button');
    I.waitForText('Are you sure you want to remove these subscriptions?');
    I.see(locationName);
    I.see(caseId);

    I.click('#bulk-unsubscribe-choice');
    I.click('Continue');
    I.waitForText('Email subscriptions updated');

    I.click('Email subscriptions');
    I.waitForText('Your email subscriptions');
    I.dontSee(locationName);
    I.dontSee(caseId);

    I.logout();
}).tag('@Nightly');

Scenario(
    'I as a verified user should be able to see proper error messages related to email subscriptions',
    async ({ I }) => {
        const displayFrom = DateTime.now().toISO({ includeOffset: false });
        const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });
        const locationId = randomData.getRandomLocationId();
        const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
        const testUserEmail = randomData.getRandomEmailAddress();

        const testUser = await createTestUserAccount(TEST_FIRST_NAME, TEST_LAST_NAME, testUserEmail);
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

        I.loginTestMediaUser(testUser['email'], secret(testConfig.TEST_USER_PASSWORD));
        I.click('#card-subscription-management');
        I.waitForText('Your email subscriptions');
        I.click('Add email subscription');
        I.waitForText('How do you want to add an email subscription?');
        I.see('You can only search for information that is currently published.');
        I.click('#subscription-choice-1');
        I.click('Continue');
        I.waitForText('Subscribe by court or tribunal name');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('At least 1 subscription is needed.');

        I.click('Add Subscriptions');
        I.click('#subscription-choice-1');
        I.click('Continue');
        I.checkOption('//*[@id="' + locationId + '"]');
        I.click('Continue');
        I.waitForText('Confirm your email subscriptions');

        I.click('Email subscriptions');
        I.click('Add email subscription');
        I.click('#subscription-choice-3');
        I.click('Continue');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('There is nothing matching your criteria');
        I.click('Add subscription by an alternative type');

        I.click('#subscription-choice-2');
        I.click('Continue');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('Please enter a minimum of 3 characters');
        I.fillField('#case-name', 'InvalidCaseName');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('There is nothing matching your criteria');
        I.click('Add subscription by an alternative type');

        I.click('#subscription-choice-1');
        I.click('Continue');
        I.click(locate('//input').withAttr({ value: 'Civil' }));
        I.click(locate('//input').withAttr({ value: 'South East' }));
        I.click('Apply filters');
        I.checkOption('//*[@id="' + locationId + '"]');
        I.click('Continue');
        I.click('Confirm Subscriptions');
        I.waitForText('Email subscriptions updated');
        I.click('Email subscriptions');

        I.click('#bulk-unsubscribe-button');
        I.waitForText('Bulk unsubscribe');
        I.click('#bulk-unsubscribe-button');
        I.waitForText('There is a problem');
        I.see('At least one subscription must be selected');

        I.click(locate('//tr').withText(locationName).find('input').withAttr({ name: 'courtSubscription' }));
        I.click('#bulk-unsubscribe-button');
        I.waitForText('Are you sure you want to remove these subscriptions?');
        I.click('#bulk-unsubscribe-choice');
        I.click('Continue');
        I.waitForText('Email subscriptions updated');
        I.logout();
    }
).tag('@Nightly');

Scenario('I as a verified user should be able to filter and select which list type to receive', async ({ I }) => {
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();

    const testUserEmail = randomData.getRandomEmailAddress();

    await createLocation(locationId, locationName);
    const testUser = await createTestUserAccount(TEST_FIRST_NAME, TEST_LAST_NAME, testUserEmail);

    I.loginTestMediaUser(testUser['email'], secret(testConfig.TEST_USER_PASSWORD));
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Add email subscription');
    I.waitForText('How do you want to add an email subscription?');
    I.see('You can only search for information that is currently published.');
    I.click('#subscription-choice-1');
    I.click('Continue');
    I.checkOption('//*[@id="' + locationId + '"]');
    I.click('Continue');
    I.click('Confirm Subscriptions');
    I.waitForText('Email subscriptions updated');
    I.click('Email subscriptions');
    I.click('Select which list types to receive');
    I.waitForText('Select List Types');
    I.click(locate('//input').withAttr({ value: 'Civil' }));
    I.click('Apply filters');
    I.uncheckOption('#CIVIL_AND_FAMILY_DAILY_CAUSE_LIST');
    I.click('Continue');
    I.waitForText('List types updated');
    I.click('manage your current email subscriptions');
    I.click('Select which list types to receive');
    I.waitForText('Select List Types');
    I.dontSeeCheckboxIsChecked('#CIVIL_AND_FAMILY_DAILY_CAUSE_LIST');
    I.click('Email subscriptions');
    I.click(locate('//tr').withText(locationName).find('a').withText('Unsubscribe'));
    I.waitForText('Are you sure you want to remove this subscription?');
    I.click('#unsubscribe-confirm');
    I.click('Continue');
    I.waitForText('Your subscription has been removed');
    I.click('Email subscriptions');
    I.dontSee(locationName);
    I.logout();
});
