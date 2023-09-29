import {DateTime} from 'luxon';
import {randomData} from '../shared/random-data';
import {config} from '../../config';
import {createLocation, uploadPublication} from '../shared/testingSupportApi';

Feature('End to end journey test for unverified user');

Scenario('I as a unverified user should be able to make end-to-end journey', async ({I}) => {
    const displayFrom = DateTime.now().toISO({includeOffset: false});
    const displayTo = DateTime.now().plus({days: 1}).toISO({includeOffset: false});
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
    await createLocation(locationId, locationName);
    await uploadPublication('PUBLIC', locationId, displayFrom, displayTo, 'ENGLISH');

    I.amOnPage('/');
    I.waitForText('Court and tribunal hearings');
    I.see('You can use this service to get information about:');
    I.see('Hearings in Civil and Family Courts in Milton Keynes, Oxford, Reading, High Wycombe and Slough');
    I.see('Single Justice Procedure cases, including TV licensing and minor traffic offences such as speeding');
    I.see('More courts and tribunals will become available over time.');
    I.see('Legal and media professionals can sign in.');
    I.see('This service is also available in Welsh (Cymraeg).');

    I.click(locate('//a').withText('Welsh (Cymraeg)'));
    I.waitForText('Gwrandawiadau llys a thribiwnlys');
    I.click(locate('//a').withText('Saesneg (English)'));
    I.waitForText('Court and tribunal hearings');

    I.click(locate('//a').withText('sign in'));
    I.seeElement('#sign-in')
    I.seeElement('#sign-in-2')
    I.seeElement('#sign-in-3')

    I.click(locate('//a').withText('Home'));
    I.waitForText('Court and tribunal hearings');
    I.click('Continue');
    I.waitForText('What do you want to do?');
    I.click(locate('#view-choice'));
    I.click('Continue');
    I.fillField('#search-input', locationName);
    I.click('Continue');
    I.waitForText('What do you want to view from ' + locationName);
    I.see('Civil and Family Daily Cause List');
    I.click(locate('//a').withText('Civil and Family Daily Cause List'));
    I.waitForText('Civil and Family Daily Cause List for ' + locationName);
    I.see('12345678');
    I.see('A1 Vs B1');

    I.click(locate('//a').withText('Home'));
    I.waitForText('Court and tribunal hearings');
    I.click('Continue');
    I.waitForText('What do you want to do?');
    I.click(locate('//a').withText('Single Justice Procedure cases'));
    I.waitForText('What do you want to view from Single Justice Procedure?');
});
