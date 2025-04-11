import { DateTime } from 'luxon';
import { randomData } from '../shared/random-data';
import { config as testConfig, config } from '../../config';
import { createLocation, uploadPublication } from '../shared/testingSupportApi';

Feature('A-Z list of courts and tribunals');

Scenario('I as a user should be able to search and filter from an A-Z list of courts and tribunals', async ({ I }) => {
    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
    await createLocation(locationId, locationName);
    await uploadPublication('PUBLIC', locationId, displayFrom, displayFrom, displayTo, 'ENGLISH');

    I.usePlaywrightTo('Go to search page', async ({ page }) => {
        page.goto(testConfig.TEST_URL + '/search');
    });
    I.waitForText('Select from an A-Z list of courts and tribunals');
    I.click('Select from an A-Z list of courts and tribunals');
    I.waitForText('Find a court or tribunal');
    I.see('Selected filter');
    I.see('Jurisdiction');
    I.see('Region');
    I.dontSee('Type of civil court');
    I.dontSee('Type of criminal court');
    I.dontSee('Type of family court');
    I.dontSee('Type of tribunal');

    I.click(locate('//input').withAttr({ value: 'Civil' }));
    I.see('Type of civil court');
    I.dontSee('Type of criminal court');
    I.dontSee('Type of family court');
    I.dontSee('Type of tribunal');
    I.click(locate('//input').withAttr({ value: 'South East' }));
    I.click('Apply filters');
    I.see(locationName);
    I.see('Type of civil court');

    I.click(locate('//input').withAttr({ value: 'South East' }));
    I.click(locate('//input').withAttr({ value: 'North West' }));
    I.click('Apply filters');
    I.dontSee(locationName);

    I.click(locate('//input').withAttr({ value: 'North West' }));
    I.click(locate('//input').withAttr({ value: 'Crime' }));
    I.see('Type of civil court');
    I.see('Type of criminal court');
    I.dontSee('Type of family court');
    I.dontSee('Type of tribunal');

    I.click(locate('//input').withAttr({ value: 'Civil' }));
    I.dontSee('Type of civil court');
    I.see('Type of criminal court');
    I.dontSee('Type of family court');
    I.dontSee('Type of tribunal');

    I.click(locate('//input').withAttr({ value: 'Magistrates' }));
    I.click(locate('//input').withAttr({ value: 'Crime' }));
    I.click('Apply filters');
    I.see(locationName);

    I.click(locationName);
    I.waitForText('What do you want to view from ' + locationName + '?');
    I.click(locate('//a').withText('Civil and Family Daily Cause List'));
    I.waitForText('Civil and Family Daily Cause List for ' + locationName);
});
