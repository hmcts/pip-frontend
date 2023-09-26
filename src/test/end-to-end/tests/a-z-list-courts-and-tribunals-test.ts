import {DateTime} from 'luxon';
import {randomData} from "../shared/random-data";
import {config} from "../../config";
import {createLocation, uploadPublication} from "../shared/testingSupportApi";

Feature('A-Z list of courts and tribunals');

Scenario('I as a user should be able to search and filter from an A-Z list of courts and tribunals', async ({I}) => {
    const displayFrom = DateTime.now().toISO({includeOffset: false});
    const displayTo = DateTime.now().plus({days: 1}).toISO({includeOffset: false});
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
    await createLocation(locationId, locationName);
    await uploadPublication(
        'PUBLIC',
        locationId,
        displayFrom,
        displayTo,
        'ENGLISH'
    );

    I.amOnPage('/search');
    I.waitForText('Want to see all courts and tribunals?');
    I.click('Select from an A-Z list of courts and tribunals');
    I.waitForText('Find a court or tribunal');
    I.see('Selected filter');
    I.see('Type of court or tribunal');
    I.see('Region');

    I.click(locate('//input').withAttr({value: 'Civil'}));
    I.click(locate('//input').withAttr({value: 'South East'}));
    I.click('Apply filters');
    I.see(locationName);

    I.click(locate('//input').withAttr({value: 'South East'}));
    I.click(locate('//input').withAttr({value: 'North West'}));
    I.click('Apply filters');
    I.dontSee(locationName);

    I.click(locate('//input').withAttr({value: 'North West'}));
    I.click('Apply filters');
    I.see(locationName);

    I.click(locate('//input').withAttr({value: 'Civil'}));
    I.click(locate('//input').withAttr({value: 'Crown'}));
    I.click('Apply filters');
    I.dontSee(locationName);

    I.click(locate('//input').withAttr({value: 'Crown'}));
    I.click('Apply filters');

    I.click('#T-selector');
    I.see('T', '#T-selector');
    I.click(locationName);
    I.waitForText('What do you want to view from ' + locationName + '?');
    I.click(locate('//a').withText('Civil and Family Daily Cause List'));
    I.waitForText('Civil and Family Daily Cause List for ' + locationName);
});
