import { DateTime } from 'luxon';
import { createLocation, uploadPublication } from '../../shared/testingSupportApi';
import { randomData } from '../../shared/random-data';
import { config } from '../../../config';

Feature('System admin blob explorer');

Scenario('I as a system admin should be able to discover content uploaded to all locations.', async ({ I }) => {
    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });

    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();

    await createLocation(locationId, locationName);
    const artefactId = await uploadPublication('PUBLIC', locationId, displayFrom, displayTo, 'ENGLISH');

    I.loginAsSystemAdmin();
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

    I.click('Link to rendered template');
    I.waitForText('Civil and Family Daily Cause List for ' + locationName);
    I.logout();
});
