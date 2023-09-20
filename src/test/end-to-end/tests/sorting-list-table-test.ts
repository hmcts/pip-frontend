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

    const firstRow = (columnNumber: number) => {
        return 'tbody > tr.govuk-table__row:nth-child(1) > td:nth-child(' + columnNumber + ')';
    };
    const lastRow = (columnNumber: number) => {
        return 'tbody > tr.govuk-table__row:last-child > td:nth-child(' + columnNumber + ')';
    };

    I.amOnPage('/search');
    I.see('What court or tribunal are you interested in?');
    I.fillField('#search-input', locationName);
    I.click('Continue');
    I.waitForText('What do you want to view from ' + locationName);
    I.click(locate('//a').withText('Primary Health Tribunal Hearing List'));
    I.waitForText('Tribunal Hearing List for Primary Health');
    I.click('Hearing Date');
    const sortedFirstDateAsc = await I.grabTextFrom(firstRow(1));
    Assert.equal(sortedFirstDateAsc, '03 September');

    const sortedLastDatAsc = await I.grabTextFrom(lastRow(1));
    Assert.equal(sortedLastDatAsc, '05 December');

    I.click('Hearing Date');
    const sortedFirstDateDesc = await I.grabTextFrom(firstRow(1));
    Assert.equal(sortedFirstDateDesc, '05 December');

    const sortedLastDateDesc = await I.grabTextFrom(lastRow(1));
    Assert.equal(sortedLastDateDesc, '03 September');

    I.click('Case Name');
    const sortedFirstCaseNameAsc = await I.grabTextFrom(firstRow(2));
    Assert.equal(sortedFirstCaseNameAsc, 'A Vs B');

    const sortedLastCaseNameAsc = await I.grabTextFrom(lastRow(2));
    Assert.equal(sortedLastCaseNameAsc, 'E Vs F');

    I.click('Case Name');
    const sortedFirstCaseNameDesc = await I.grabTextFrom(firstRow(2));
    Assert.equal(sortedFirstCaseNameDesc, 'E Vs F');

    const sortedLastCaseNameDesc = await I.grabTextFrom(lastRow(2));
    Assert.equal(sortedLastCaseNameDesc, 'A Vs B');

    I.click('Duration');
    const sortedFirstDurationAsc = await I.grabTextFrom(firstRow(3));
    Assert.equal(sortedFirstDurationAsc, '30 mins [2 of 3]');

    const sortedLastDurationAsc = await I.grabTextFrom(lastRow(3));
    Assert.equal(sortedLastDurationAsc, '4 days [2 of 3]');

    I.click('Duration');
    const sortedFirstDurationDesc = await I.grabTextFrom(firstRow(3));
    Assert.equal(sortedFirstDurationDesc, '4 days [2 of 3]');

    const sortedLastDurationDesc = await I.grabTextFrom(lastRow(3));
    Assert.equal(sortedLastDurationDesc, '30 mins [2 of 3]');

    I.click('Hearing Type');
    const sortedFirstHearingTypeAsc = await I.grabTextFrom(firstRow(4));
    Assert.equal(sortedFirstHearingTypeAsc, 'MDA');

    const sortedLastHearingTypeAsc = await I.grabTextFrom(lastRow(4));
    Assert.equal(sortedLastHearingTypeAsc, 'Remote - Teams');

    I.click('Hearing Type');
    const sortedFirstHearingTypeDesc = await I.grabTextFrom(firstRow(4));
    Assert.equal(sortedFirstHearingTypeDesc, 'Remote - Teams');

    const sortedLastHearingTypeDesc = await I.grabTextFrom(lastRow(4));
    Assert.equal(sortedLastHearingTypeDesc, 'MDA');

    I.click('Venue');
    const sortedFirstVenueAsc = await I.grabTextFrom(firstRow(5));
    Assert.ok(sortedFirstVenueAsc.toString().includes('BOLTON'));

    const sortedLastVenueAsc = await I.grabTextFrom(lastRow(5));
    Assert.ok(sortedLastVenueAsc.toString().includes('PRESTON'));

    I.click('Venue');
    const sortedFirstVenueDesc = await I.grabTextFrom(firstRow(5));
    Assert.ok(sortedFirstVenueDesc.toString().includes('PRESTON'));

    const sortedLastVenueDesc = await I.grabTextFrom(lastRow(5));
    Assert.ok(sortedLastVenueDesc.toString().includes('BOLTON'));
});
