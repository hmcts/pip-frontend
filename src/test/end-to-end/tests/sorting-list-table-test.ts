import { DateTime } from 'luxon';
import { createLocation, uploadPublication } from '../shared/testingSupportApi';
import { randomData } from '../shared/random-data';
import { config } from '../../config';
import * as Assert from 'assert';

Feature('Sort List Table');

Scenario('I should be able to view and sort the list table', async ({ I }) => {
    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();

    await createLocation(locationId, locationName);
    await uploadPublication(
        'PUBLIC',
        locationId,
        displayFrom,
        displayTo,
        'ENGLISH',
        'primaryHealthList.json',
        'PRIMARY_HEALTH_LIST'
    );

    I.amOnPage('/search');
    I.see('What court or tribunal are you interested in?');
    I.fillField('#search-input', locationName);
    I.click('Continue');
    I.waitForText('What do you want to view from ' + locationName);
    I.click(locate('//a').withText('Primary Health Tribunal Hearing List'));
    I.waitForText('Primary Health\n' + 'Tribunal Hearing List');
    I.click('Hearing Date');
    const sortedFirstDate = await I.grabTextFrom('tbody > tr.govuk-table__row:nth-child(1) > td:nth-child(1)');
    Assert.equal(sortedFirstDate, '03 September');

    const sortedLastDate = await I.grabTextFrom('tbody > tr.govuk-table__row:last-child > td:nth-child(1)');
    Assert.equal(sortedLastDate, '05 December');

    I.click('Case Name');
    const sortedFirstCaseName = await I.grabTextFrom('tbody > tr.govuk-table__row:nth-child(1) > td:nth-child(2)');
    Assert.equal(sortedFirstCaseName, 'A Vs B');

    const sortedLastCaseName = await I.grabTextFrom('tbody > tr.govuk-table__row:last-child > td:nth-child(2)');
    Assert.equal(sortedLastCaseName, 'E Vs F');

    I.click('Duration');
    const sortedFirstDuration = await I.grabTextFrom('tbody > tr.govuk-table__row:nth-child(1) > td:nth-child(3)');
    Assert.equal(sortedFirstDuration, '30 mins [2 of 3]');

    const sortedLastDuration = await I.grabTextFrom('tbody > tr.govuk-table__row:last-child > td:nth-child(3)');
    Assert.equal(sortedLastDuration, '4 days [2 of 3]');

    I.click('Hearing Type');
    const sortedFirstHearingType = await I.grabTextFrom('tbody > tr.govuk-table__row:nth-child(1) > td:nth-child(4)');
    Assert.equal(sortedFirstHearingType, 'MDA');

    const sortedLastHearingType = await I.grabTextFrom('tbody > tr.govuk-table__row:last-child > td:nth-child(4)');
    Assert.equal(sortedLastHearingType, 'Remote - Teams');

    I.click('Venue');
    const sortedFirstVenue = await I.grabTextFrom('tbody > tr.govuk-table__row:nth-child(1) > td:nth-child(5)');
    Assert.ok(sortedFirstVenue.toString().includes('BOLTON'));

    const sortedLastVenue = await I.grabTextFrom('tbody > tr.govuk-table__row:last-child > td:nth-child(5)');
    Assert.ok(sortedLastVenue.toString().includes('PRESTON'));
});
