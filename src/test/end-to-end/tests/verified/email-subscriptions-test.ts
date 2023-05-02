import {DateTime} from 'luxon';
import {createLocation, uploadPublication} from '../../shared/testingSupportApi';
import {generateTestLocation, removeTestLocationFile} from '../../shared/shared-functions';

Feature('Email subscriptions');
const caseId = '12341234';
const caseName = 'Test Case Name';
const caseURN = 'Case URN';

Scenario(
    'I as a verified user should be able to subscribe by court name, URN, case id and case name. Also ' +
    'should be able to remove subscription and bulk unsubscribe',
    async ({I}) => {
        const displayFrom = DateTime.now().toISO({includeOffset: false});
        const displayTo = DateTime.now().plus({days: 1}).toISO({includeOffset: false});
        const [locationId, locationName, locationFileName] = generateTestLocation();

        await createLocation(locationFileName);
        await uploadPublication(
            'PUBLIC',
            locationId,
            displayFrom,
            displayTo,
            'ENGLISH',
            'etDailyList.json',
            'ET_DAILY_LIST'
        );

        I.loginAsMediaUser();
        I.waitForText('Your account');
        I.click('#card-subscription-management');
        ``;
        I.waitForText('Your email subscriptions');
        I.click('Add email subscription');
        I.waitForText('How do you want to add an email subscription?');
        I.see('You can only search for information that is currently published.');
        I.click('#subscription-choice-4');
        I.click('Continue');
        I.checkOption('//*[@id="' + locationId + '"]');
        I.click('Continue');
        I.click('Confirm Subscriptions');
        I.waitForText('Subscription(s) confirmed');
        I.see('Your subscription(s) has been added successfully');

        I.click('Email subscriptions');
        I.click('Add email subscription');
        I.click('#subscription-choice-1');
        I.click('Continue');
        I.waitForText('What is the case reference number or case ID?');
        I.see('You must enter an exact match.');
        I.fillField('#search-input', caseId);
        I.click('Continue');
        I.waitForText('Search result');
        I.see('1 result successfully found');
        I.see(caseId);
        I.click('Continue');
        I.waitForText('Confirm your email subscriptions');
        I.click('Confirm Subscriptions');
        I.waitForText('Subscription(s) confirmed');
        I.see('Your subscription(s) has been added successfully');

        I.click('Email subscriptions');
        I.click('Add email subscription');
        I.click('#subscription-choice-2');
        I.click('Continue');
        I.waitForText('What is the unique reference number (URN)?');
        I.see('You must enter an exact match.');
        I.fillField('#search-input', caseURN);
        I.click('Continue');
        I.waitForText('Search result');
        I.see('1 result successfully found');
        I.see(caseURN);
        I.click('Continue');
        I.waitForText('Confirm your email subscriptions');
        I.click('Confirm Subscriptions');
        I.waitForText('Subscription(s) confirmed');
        I.see('Your subscription(s) has been added successfully');

        I.click('Email subscriptions');
        I.click('Add email subscription');
        I.click('#subscription-choice-3');
        I.click('Continue');
        I.waitForText('What is the name of the case?');
        I.see('For example, Smith');
        I.fillField('#case-name', caseName);
        I.click('Continue');
        I.waitForText('Search result');
        I.see(caseName);
        I.checkOption('//*[@id="12341232"]');
        I.click('Continue');
        I.waitForText('Confirm your email subscriptions');
        I.click('Confirm Subscriptions');
        I.waitForText('Subscription(s) confirmed');
        I.see('Your subscription(s) has been added successfully');

        I.click('Email subscriptions');
        I.waitForText('All subscriptions');
        I.see(locationName);
        I.see(caseId);
        I.see(caseName);
        I.see(caseURN);

        I.click('Subscriptions by case');
        I.dontSee(locationName);
        I.see(caseId);
        I.see(caseName);
        I.see(caseURN);

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
        I.waitForText('Your subscription has been removed.');

        I.click('Email subscriptions');
        I.click('#bulk-unsubscribe-button');
        I.click(locate('//tr').withText(caseName).find('input').withAttr({id: 'caseSubscription'}));

        I.click(locate('//tr').withText(locationName).find('input').withAttr({id: 'courtSubscription'}));
        I.click(locate('//tr').withText(caseId).find('input').withAttr({id: 'caseSubscription'}));

        I.click('#bulk-unsubscribe-button');
        I.waitForText('Are you sure you want to remove these subscriptions?');
        I.click('#bulk-unsubscribe-choice');
        I.click('Continue');
        I.waitForText('Subscription(s) removed');
        I.see('Your subscription(s) has been removed.');

        I.deletePublicationForCourt(locationId);
        I.deleteLocation(locationId);
        await removeTestLocationFile(locationFileName);
    }
).tag('@CrossBrowser');

Scenario(
    'I as a verified user should be able to see proper error messages related to email subscriptions',
    async ({I}) => {
        const displayFrom = DateTime.now().toISO({includeOffset: false});
        const displayTo = DateTime.now().plus({days: 1}).toISO({includeOffset: false});
        const [locationId, locationName, locationFileName] = generateTestLocation();
        await createLocation(locationFileName);
        await uploadPublication(
            'PUBLIC',
            locationId,
            displayFrom,
            displayTo,
            'ENGLISH',
            'etDailyList.json',
            'ET_DAILY_LIST'
        );

        I.loginAsMediaUser();
        I.waitForText('Your account');
        I.click('#card-subscription-management');
        I.waitForText('Your email subscriptions');
        I.click('Add email subscription');
        I.waitForText('How do you want to add an email subscription?');
        I.see('You can only search for information that is currently published.');
        I.click('#subscription-choice-4');
        I.click('Continue');
        I.waitForText('Subscribe by court or tribunal name');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('At least 1 subscription is needed.');

        I.click('Add Subscriptions');
        I.click('#subscription-choice-1');
        I.click('Continue');
        I.waitForText('What is the case reference number or case ID?');
        I.fillField('#search-input', caseId);
        I.click('Continue');
        I.waitForText('Search result');
        I.see('1 result successfully found');
        I.see(caseId);
        I.click('Continue');
        I.click('Add another email Subscription');

        I.waitForText('How do you want to add an email subscription?');
        I.click('#subscription-choice-4');
        I.click('Continue');
        I.checkOption('//*[@id="' + locationId + '"]');
        I.click('Continue');
        I.waitForText('Confirm your email subscriptions');

        I.click('Email subscriptions');
        I.click('Add email subscription');
        I.click('#subscription-choice-2');
        I.click('Continue');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('There is nothing matching your criteria');
        I.click('Add subscription by an alternative type');

        I.click('#subscription-choice-1');
        I.click('Continue');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('There is nothing matching your criteria');
        I.click('Add subscription by an alternative type');

        I.click('#subscription-choice-3');
        I.click('Continue');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('Please enter a minimum of 3 characters');
        I.fillField('#case-name', 'InvalidCaseName');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('There is nothing matching your criteria');
        I.click('Add subscription by an alternative type');

        I.click('#subscription-choice-4');
        I.click('Continue');
        I.click(locate('//input').withAttr({value: 'Civil'}));
        I.click(locate('//input').withAttr({value: 'South East'}));
        I.click('Apply filters');
        I.checkOption('//*[@id="' + locationId + '"]');
        I.click('Continue');
        I.click('Confirm Subscriptions');
        I.waitForText('Subscription(s) confirmed');
        I.click('Email subscriptions');

        I.click('#bulk-unsubscribe-button');
        I.waitForText('Bulk unsubscribe');
        I.click('#bulk-unsubscribe-button');
        I.waitForText('There is a problem');
        I.see('At least one subscription must be selected');
        I.click(locate('//tr').withText(locationName).find('input').withAttr({id: 'courtSubscription'}));
        I.click('#bulk-unsubscribe-button');
        I.waitForText('Are you sure you want to remove these subscriptions?');
        I.click('#bulk-unsubscribe-choice');
        I.click('Continue');
        I.waitForText('Subscription(s) removed');

        I.deletePublicationForCourt(locationId);
        I.deleteLocation(locationId);
        await removeTestLocationFile(locationFileName);
    }
);

Scenario('I as a verified user should be able to filter and select which list type to receive', async ({I}) => {
    const [locationId, locationName, locationFileName] = generateTestLocation();
    await createLocation(locationFileName);

    I.loginAsMediaUser();
    I.waitForText('Your account');
    I.click('#card-subscription-management');
    I.waitForText('Your email subscriptions');
    I.click('Add email subscription');
    I.waitForText('How do you want to add an email subscription?');
    I.see('You can only search for information that is currently published.');
    I.click('#subscription-choice-4');
    I.click('Continue');
    I.checkOption('//*[@id="' + locationId + '"]');
    I.click('Continue');
    I.click('Confirm Subscriptions');
    I.waitForText('Subscription(s) confirmed');
    I.see('Your subscription(s) has been added successfully');
    I.click('Email subscriptions');
    I.click('Select which list types to receive');
    I.waitForText('Select List Types');
    I.click(locate('//input').withAttr({value: 'Civil'}));
    I.click('Apply filters');
    I.uncheckOption('#CIVIL_AND_FAMILY_DAILY_CAUSE_LIST');
    I.click('Continue');
    I.waitForText('Court Subscription(s) refined');
    I.see('Your subscription(s) has been amended successfully');
    I.click('manage your current email subscriptions');
    I.click('Select which list types to receive');
    I.waitForText('Select List Types');
    I.dontSeeCheckboxIsChecked('#CIVIL_AND_FAMILY_DAILY_CAUSE_LIST');
    I.click('Email subscriptions');
    I.click(locate('//tr').withText(locationName).find('a').withText('Unsubscribe'));
    I.waitForText('Are you sure you want to remove this subscription?');
    I.click('#unsubscribe-confirm');
    I.click('Continue');
    I.waitForText('Your subscription has been removed.');
    I.click('Email subscriptions');
    I.dontSee(locationName);
    I.deleteLocation(locationId);
    await removeTestLocationFile(locationFileName);
});