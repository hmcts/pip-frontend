import { DateTime } from 'luxon';
import { createLocation, uploadPublication } from '../../shared/testingSupportApi';
import { randomData } from '../../shared/random-data';
import { config } from '../../../config';

Feature('System admin blob explorer');

const displayFrom = DateTime.now().toISO({ includeOffset: false });
const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });

Scenario('I as a system admin should be able to discover content uploaded to all locations.', async ({ I }) => {
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();

    await createLocation(locationId, locationName);
    const artefactId = await uploadPublication('PUBLIC', locationId, displayFrom, displayFrom, displayTo, 'ENGLISH');

    I.loginAsSsoSystemAdmin();
    I.click('#card-blob-view-locations');
    I.waitForText('Blob Explorer - Locations');
    I.see('Choose a location to see all publications associated with it.');
    I.see(locationName);
    I.click(locationName);
    I.waitForText('Blob Explorer - Publications');
    I.see(locationName);
    I.see('Choose a publication from the list.');
    I.click(artefactId);
    I.waitForText('Blob Explorer - JSON file');
    I.see('Re-submit subscription');
    I.see('Metadata');
    I.see(locationId);
    I.see(locationName);
    I.see(artefactId);
    I.see('Public');
    I.see('English');
    I.see('Link to rendered template');
    I.see('View Raw JSON Content');

    I.click('.govuk-details__summary-text');
    I.waitForText('document');
    I.click('.govuk-details__summary-text');
    I.dontSee('document');

    I.click('Link to rendered template');
    I.waitForText('Civil and Family Daily Cause List for ' + locationName);

    I.logoutSsoSystemAdmin();
});

Scenario('I as a system admin should be able to re-submit subscription for a publication', async ({ I }) => {
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();

    await createLocation(locationId, locationName);
    const artefactId = await uploadPublication('PUBLIC', locationId, displayFrom, displayFrom, displayTo, 'ENGLISH');

    I.loginAsSsoSystemAdmin();
    I.click('#card-blob-view-locations');
    I.waitForText('Blob Explorer - Locations');
    I.click(locationName);
    I.waitForText('Blob Explorer - Publications');
    I.click(artefactId);
    I.waitForText('Blob Explorer - JSON file');

    I.click('Re-submit subscription');
    I.waitForText('Confirm subscription re-submission');
    I.see(locationName);
    I.see('MANUAL_UPLOAD');
    I.see('English');
    I.see('Public');
    I.see('Confirm');
    I.see('Cancel');

    I.click('Cancel');
    I.waitForText('Blob Explorer - Locations');
    I.click(locationName);
    I.waitForText('Blob Explorer - Publications');
    I.click(artefactId);
    I.waitForText('Blob Explorer - JSON file');
    I.click('Re-submit subscription');
    I.waitForText('Confirm subscription re-submission');

    I.click('Confirm');
    I.waitForText('Subscription re-submitted');
    I.see('What do you want to do next?');
    I.see('Blob explorer - Locations');

    I.click('Blob explorer - Locations');
    I.waitForText('Choose a location to see all publications associated with it.');

    I.logoutSsoSystemAdmin();
}).tag('@Nightly');
