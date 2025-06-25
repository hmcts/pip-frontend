import { DateTime } from 'luxon';
import { createLocation, uploadPublication } from '../shared/testingSupportApi';
import { randomData } from '../shared/random-data';
import { config as testConfig, config } from '../../config';
import * as Assert from 'assert';

Feature('Style guide table sorting');

Scenario('I should be able to view and sort the table on style guide', async ({ I }) => {
    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();

    await createLocation(locationId, locationName);
    await uploadPublication(
        'PUBLIC',
        locationId,
        displayFrom,
        displayFrom,
        displayTo,
        'ENGLISH',
        'civilDailyCauseList.json',
        'CIVIL_DAILY_CAUSE_LIST'
    );

    const firstRow = (columnNumber: number) => {
        return 'tbody > tr.govuk-table__row:nth-child(1) > td:nth-child(' + columnNumber + ')';
    };
    const lastRow = (columnNumber: number) => {
        return 'tbody > tr.govuk-table__row:last-child > td:nth-child(' + columnNumber + ')';
    };

    I.usePlaywrightTo('Go to search page', async ({ page }) => {
        page.goto(testConfig.TEST_URL + '/search');
    });
    I.see('What court or tribunal are you interested in?');
    I.fillField('#search-input', locationName);
    I.click('Continue');
    I.waitForText('What do you want to view from ' + locationName);
    I.click(locate('//a').withText('Primary Health Tribunal Hearing List'));
    I.waitForText('Tribunal Hearing List for Primary Health');
    I.click('Time');
    const sortedFirstDateAsc = await I.grabTextFrom(firstRow(1));
    Assert.equal(sortedFirstDateAsc, '9:05am');

    const sortedLastTimeAsc = await I.grabTextFrom(lastRow(1));
    Assert.equal(sortedLastTimeAsc, '2pm');

    I.click('Time');
    const sortedFirstTimeDesc = await I.grabTextFrom(firstRow(1));
    Assert.equal(sortedFirstTimeDesc, '2pm');

    const sortedLastTimeDesc = await I.grabTextFrom(lastRow(1));
    Assert.equal(sortedLastTimeDesc, '9:05am');

    I.click('Case ID');
    const sortedFirstCaseIdAsc = await I.grabTextFrom(firstRow(2));
    Assert.equal(sortedFirstCaseIdAsc, '12345678');

    const sortedLastCaseIdAsc = await I.grabTextFrom(lastRow(2));
    Assert.equal(sortedLastCaseIdAsc, '22345678');

    I.click('Case ID');
    const sortedFirstCaseIdDesc = await I.grabTextFrom(firstRow(2));
    Assert.equal(sortedFirstCaseIdDesc, '22345678');

    const sortedLastCaseIdDesc = await I.grabTextFrom(lastRow(2));
    Assert.equal(sortedLastCaseIdDesc, '12345678');

    I.click('Case name');
    const sortedFirstCaseNameAsc = await I.grabTextFrom(firstRow(2));
    Assert.equal(sortedFirstCaseNameAsc, 'A1 Vs B1');

    const sortedLastCaseNameAsc = await I.grabTextFrom(lastRow(2));
    Assert.equal(sortedLastCaseNameAsc, 'A3 Vs B3');

    I.click('Case name');
    const sortedFirstCaseNameDesc = await I.grabTextFrom(firstRow(2));
    Assert.equal(sortedFirstCaseNameDesc, 'A3 Vs B3');

    const sortedLastCaseNameDesc = await I.grabTextFrom(lastRow(2));
    Assert.equal(sortedLastCaseNameDesc, 'A1 Vs B1');

    I.click('Case type');
    const sortedFirstCaseTypeAsc = await I.grabTextFrom(firstRow(4));
    Assert.equal(sortedFirstCaseTypeAsc, 'A case type');

    const sortedLastCaseTypeAsc = await I.grabTextFrom(lastRow(4));
    Assert.equal(sortedLastCaseTypeAsc, 'New type');

    I.click('Case type');
    const sortedFirstCaseTypeDesc = await I.grabTextFrom(firstRow(4));
    Assert.equal(sortedFirstCaseTypeDesc, 'New type');

    const sortedLastCaseTypeDesc = await I.grabTextFrom(lastRow(4));
    Assert.equal(sortedLastCaseTypeDesc, 'A case type');

    I.click('Hearing type');
    const sortedFirstHearingTypeAsc = await I.grabTextFrom(firstRow(4));
    Assert.equal(sortedFirstHearingTypeAsc, 'Hearing type A');

    const sortedLastHearingTypeAsc = await I.grabTextFrom(lastRow(4));
    Assert.equal(sortedLastHearingTypeAsc, 'Hearing type B');

    I.click('Hearing type');
    const sortedFirstHearingTypeDesc = await I.grabTextFrom(firstRow(4));
    Assert.equal(sortedFirstHearingTypeDesc, 'Hearing type B');

    const sortedLastHearingTypeDesc = await I.grabTextFrom(lastRow(4));
    Assert.equal(sortedLastHearingTypeDesc, 'Hearing type A');

    I.click('Location');
    const sortedFirstLocationAsc = await I.grabTextFrom(firstRow(5));
    Assert.ok(sortedFirstLocationAsc.toString().includes('In Person'));

    const sortedLastLocationAsc = await I.grabTextFrom(lastRow(5));
    Assert.ok(sortedLastLocationAsc.toString().includes('Remote, Teams'));

    I.click('Location');
    const sortedFirstLocationDesc = await I.grabTextFrom(firstRow(5));
    Assert.ok(sortedFirstLocationDesc.toString().includes('Remote, Teams'));

    const sortedLastLocationDesc = await I.grabTextFrom(lastRow(5));
    Assert.ok(sortedLastLocationDesc.toString().includes('In Person'));

    I.click('Duration');
    const sortedFirstDurationAsc = await I.grabTextFrom(firstRow(3));
    Assert.equal(sortedFirstDurationAsc, '40 mins');

    const sortedLastDurationAsc = await I.grabTextFrom(lastRow(3));
    Assert.equal(sortedLastDurationAsc, '2 hours');

    I.click('Duration');
    const sortedFirstDurationDesc = await I.grabTextFrom(firstRow(3));
    Assert.equal(sortedFirstDurationDesc, '2 hours');

    const sortedLastDurationDesc = await I.grabTextFrom(lastRow(3));
    Assert.equal(sortedLastDurationDesc, '40 mins');
});
