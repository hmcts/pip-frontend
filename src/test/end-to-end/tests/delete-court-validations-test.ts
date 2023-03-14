import { DateTime } from 'luxon';
import { createLocation, createSubscription, uploadPublication } from '../shared/testingSupportApi';

Feature('Delete Location');
Scenario(
    'I as a system admin should be able to delete court only when there are no active subscriptions or artefacts',
    async ({ I }) => {
        const displayFrom = DateTime.now().toISO({ includeOffset: false });
        const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });

        const LOCATION_ID = '201';
        const LOCATION_NAME = 'TestCourt201';

        await createLocation('delete-court-validations.csv');
        await createSubscription(LOCATION_ID, LOCATION_NAME);
        await uploadPublication('PUBLIC', LOCATION_ID, displayFrom, displayTo, 'ENGLISH');
        I.wait(5);
        I.loginAsSystemAdmin();
        I.click('Delete Court');
        I.fillField('#search-input', LOCATION_NAME);
        I.click('Continue');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('There are active artefacts for the given location.');
        I.click('Click here to delete all the artefact(s) for ' + LOCATION_NAME);
        I.waitForText('Are you sure you want to delete all the publications?');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('Success');
        I.see('Court publication(s) has been deleted');

        I.click('Continue deletion of ' + LOCATION_NAME);
        I.waitForText('Are you sure you want to delete this court?');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('There are active subscriptions for the given location.');
        I.click('Click here to delete all the subscription(s) for ' + LOCATION_NAME);
        I.waitForText('Are you sure you want to delete all the subscriptions?');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('Success');
        I.see('Court subscription(s) has been deleted');

        I.click('Continue deletion of ' + LOCATION_NAME);
        I.waitForText('Are you sure you want to delete this court?');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('Success');
        I.see('Court has been deleted');
    }
);
