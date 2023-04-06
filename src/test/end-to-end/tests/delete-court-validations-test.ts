import { DateTime } from 'luxon';
import { createLocation, createSubscription, uploadPublication } from '../shared/testingSupportApi';
import { generateTestLocation } from '../shared/shared-functions';

Feature('Delete Location');
Scenario(
    'I as a system admin should be able to delete court only when there are no active subscriptions or artefacts',
    async ({ I }) => {
        const displayFrom = DateTime.now().toISO({ includeOffset: false });
        const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });

        const USER_ID = '0e68f98c-29c5-4eff-aa26-0a872ee8bf86';
        const [locationId, locationName, testLocationFileName] = generateTestLocation();

        await createLocation(testLocationFileName);
        await createSubscription(locationId, locationName, USER_ID);
        await uploadPublication('PUBLIC', locationId, displayFrom, displayTo, 'ENGLISH');

        I.loginAsSystemAdmin();
        I.click('Delete Court');
        I.fillField('#search-input', locationName);
        I.click('Continue');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('There are active artefacts for the given location.');
        I.click('Click here to delete all the artefact(s) for ' + locationName);
        I.waitForText('Are you sure you want to delete all the publications?');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('Success');
        I.see('Court publication(s) has been deleted');

        I.click('Continue deletion of ' + locationName);
        I.waitForText('Are you sure you want to delete this court?');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('There are active subscriptions for the given location.');
        I.click('Click here to delete all the subscription(s) for ' + locationName);
        I.waitForText('Are you sure you want to delete all the subscriptions?');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('Success');
        I.see('Court subscription(s) has been deleted');

        I.click('Continue deletion of ' + locationName);
        I.waitForText('Are you sure you want to delete this court?');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('Success');
        I.see('Court has been deleted');
    }
);
