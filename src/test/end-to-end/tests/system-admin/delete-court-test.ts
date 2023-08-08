import { DateTime } from 'luxon';
import { createLocation, createSubscription, uploadPublication } from '../../shared/testingSupportApi';
import { randomData } from '../../shared/random-data';
import { config } from '../../../config';

Feature('System admin delete location');

Scenario(
    'I as a system admin should be able to delete court only when there are no active subscriptions or artefacts',
    async ({ I }) => {
        const displayFrom = DateTime.now().toISO({ includeOffset: false });
        const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });

        const USER_ID = '0e68f98c-29c5-4eff-aa26-0a872ee8bf86';
        const locationId = randomData.getRandomLocationId();
        const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();

        await createLocation(locationId, locationName);
        await createSubscription(locationId, locationName, USER_ID);
        await uploadPublication('PUBLIC', locationId, displayFrom, displayTo, 'ENGLISH');

        function tryToDeleteCourt() {
            I.fillField('#search-input', locationName);
            I.click('Continue', null, { noWaitAfter: true });
            I.waitForText('Are you sure you want to delete this court?');
            I.click('#delete-choice');
            I.click('Continue', null, { noWaitAfter: true });
            I.waitForText('There is a problem');
        }

        I.loginAsSystemAdmin();
        I.waitForText('System Admin Dashboard');
        I.click('Delete Court');

        await tryToDeleteCourt();
        I.see('There are active artefacts for the given location.');
        I.click('Click here to delete all the artefact(s) for ' + locationName);
        I.waitForText('Are you sure you want to delete all the publications?');
        I.click('#delete-choice-2');
        I.click('Continue');
        I.waitForText('Find the court to remove');

        await tryToDeleteCourt();
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
        I.click('#delete-choice-2');
        I.click('Continue');
        I.waitForText('Find the court to remove');

        await tryToDeleteCourt();
        I.see('There are active subscriptions for the given location.');
        I.click('Click here to delete all the subscription(s) for ' + locationName);
        I.waitForText('Are you sure you want to delete all the subscriptions?');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('Success');
        I.see('Court subscription(s) has been deleted');

        I.click('Continue deletion of ' + locationName, null, { noWaitAfter: true });
        I.waitForText('Are you sure you want to delete this court?');
        I.click('#delete-choice');
        I.click('Continue', null, { noWaitAfter: true });
        I.waitForText('Success');
        I.see('Court has been deleted');
        I.logout();
    }
);

Scenario(
    'I as a system admin should be able to see proper information texts and error messages related to delete court',
    async ({ I }) => {
        I.loginAsSystemAdmin();
        I.see('Delete Court');
        I.click('Delete Court');
        I.see('Find the court to remove');
        I.see('Search by court or tribunal name');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('Court or tribunal name must be 3 characters or more');
        I.fillField('#search-input', 'InvalidCourtName');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('There are no matching results');
        I.fillField('#search-input', 'Single Justice Procedure');
        I.click('Continue');
        I.waitForText('Are you sure you want to delete this court?');
        I.click('#delete-choice-2');
        I.click('Continue');
        I.see('Find the court to remove');
        I.see('Search by court or tribunal name');
        I.logout();
    }
);
