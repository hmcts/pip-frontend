import { DateTime } from 'luxon';
import { createLocation, uploadPublication } from '../../shared/testingSupportApi';
import { randomData } from '../../shared/random-data';
import { config } from '../../../config';

Feature('Admin remove list');
const listType = 'Civil And Family Daily Cause List';
const displayFrom = DateTime.now().toISO({ includeOffset: false });
const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });

Scenario('I as an admin user should be able to remove list from the court', async ({ I }) => {
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
    await createLocation(locationId, locationName);
    await uploadPublication('PUBLIC', locationId, displayFrom, displayTo, 'ENGLISH');
    I.loginAsAdmin();
    I.click('#card-remove-list-search');
    I.waitForText('Find content to remove');
    I.see('Search by court or tribunal name');
    I.see('For example, Blackburn Crown Court');
    I.fillField('#search-input', locationName);
    I.click('Continue');
    I.waitForText('Select content to remove');
    I.click(locate('//tr').withText(listType).find('a').withText('Remove'));
    I.waitForText('You are about to remove the following publication:');
    I.see(locationName);
    I.see(listType);
    I.click('#remove-choice');
    I.click('Continue');
    I.waitForText('Success');
    I.see('What do you want to do next?');
    I.see('Your file has been removed');
    I.seeElement(locate('//a').withText('Remove another file'));
    I.seeElement(locate('//a').withText('Upload a file'));
    I.seeElement(locate('//a').withText('Home'));
    I.click('Remove another file');
    I.waitForText('Find content to remove');
    I.fillField('#search-input', locationName);
    I.click('Continue');
    I.waitForText('Showing 0 result(s)');
    I.logout();
}).tag('@CrossBrowser');

Scenario('I as an admin user should be able to see proper error messages related to remove list', async ({ I }) => {
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
    await createLocation(locationId, locationName);
    await uploadPublication('PUBLIC', locationId, displayFrom, displayTo, 'ENGLISH');

    I.loginAsAdmin();
    I.click('#card-remove-list-search');
    I.waitForText('Find content to remove');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.see('Court or tribunal name must be 3 characters or more');

    I.fillField('#search-input', 'Invalid location name');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.see('There are no matching results');

    I.fillField('#search-input', locationName);
    I.click('Continue');
    I.waitForText('Select content to remove');
    I.click(locate('//tr').withText(listType).find('a').withText('Remove'));
    I.waitForText('You are about to remove the following publication:');
    I.see(locationName);
    I.see(listType);
    I.click('#remove-choice-2');
    I.click('Continue');
    I.waitForText('Select content to remove');
    I.logout();
});
