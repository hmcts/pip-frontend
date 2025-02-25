import { DateTime } from 'luxon';
import { createLocation, uploadPublication } from '../shared/testingSupportApi';
import Assert from 'assert';
import { config, config as testConfig } from '../../config';
import { randomData } from '../shared/random-data';

Feature('SJP List Filter And Paging');

Scenario('I should be able to view all the SJP cases', async ({ I }) => {
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
    await createLocation(locationId, locationName);

    const contentDate = DateTime.now().plus({ months: 1 });
    const sjpList = 'Single Justice Procedure Public List (Full List) ' + contentDate.toFormat('dd MMMM yyyy');
    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });

    await uploadPublication(
        'PUBLIC',
        locationId,
        contentDate.toISO({ includeOffset: false }),
        displayFrom,
        displayTo,
        'ENGLISH',
        'sjp-paging-and-filter.json',
        'SJP_PUBLIC_LIST'
    );

    I.usePlaywrightTo('Go to home page', async ({ page }) => {
        page.goto(testConfig.TEST_URL + '/');
    });
    I.see('Court and tribunal hearings');
    I.click('Continue');
    I.waitForText('What do you want to do?');
    I.click('#view-choice');
    I.click('Continue');
    I.waitForText('What court or tribunal are you interested in?');
    I.fillField('#search-input', locationName);
    I.click('Continue');
    I.waitForText('What do you want to view from ' + locationName);
    I.click(locate('//a').withText(sjpList));
    I.waitForText('Single Justice Procedure cases that are ready for hearing (Full list)');
    I.see('Next');
    I.dontSee('Previous');
    I.click(locate('//a').withText('3'));
    I.dontSee('Next');
    I.see('Previous');

    I.click('#show-filters');
    I.waitForText('Search filters');
    I.click('#search-filters');
    I.fillField('#search-filters', 'A1');
    I.see('A1');
    I.click('#postcodes-1');
    I.click('Apply filters');

    const rowsLocator = locate('#main-content > div > div.parent-box.overflow-table > div > table > tbody > tr');
    const allRows = await I.grabNumberOfVisibleElements(rowsLocator);
    for (let i = 1; i <= allRows; i++) {
        const postCode = await I.grabTextFrom(
            '#main-content > div > div.parent-box.overflow-table > div > table > tbody > tr:nth-child(' +
                i +
                ') > td:nth-child(2)'
        );
        Assert.equal(postCode, 'A1');
    }

    I.click('#prosecutor-525');
    I.click('Apply filters');

    const filteredRows = await I.grabNumberOfVisibleElements(rowsLocator);
    for (let i = 1; i <= filteredRows; i++) {
        const postCode = await I.grabTextFrom(
            '#main-content > div > div.parent-box.overflow-table > div > table > tbody > tr:nth-child(' +
                i +
                ') > td:nth-child(2)'
        );
        const prosecutor = await I.grabTextFrom(
            '#main-content > div > div.parent-box.overflow-table > div > table > tbody > tr:nth-child(' +
                i +
                ') > td:nth-child(4)'
        );
        Assert.equal(postCode, 'A1');
        Assert.equal(prosecutor, 'NEBULEAN');
    }
});
