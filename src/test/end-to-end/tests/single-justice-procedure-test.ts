import { DateTime } from 'luxon';
import { createLocation, uploadPublication } from '../shared/testingSupportApi';
import { config, config as testConfig } from '../../config';
import { randomData } from '../shared/random-data';

Feature('Single Justice Procedure cases');

Scenario('I should be able to view all the single procedure cases', async ({ I }) => {
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
    await createLocation(locationId, locationName);

    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });

    const artefactId = await uploadPublication(
        'PUBLIC',
        locationId,
        displayFrom,
        displayFrom,
        displayTo,
        'ENGLISH',
        'primaryHealthList.json',
        'PRIMARY_HEALTH_LIST'
    );

    I.usePlaywrightTo('Go to home page', async ({ page }) => {
        page.goto(testConfig.TEST_URL + '/');
    });
    I.see('Court and tribunal hearings');
    I.click('Continue');
    I.waitForText('What do you want to do?');
    I.click('Find a Single Justice Procedure case');
    I.click('Continue');
    I.waitForText('What do you want to view from Single Justice Procedure?');
    I.see('Primary Health Tribunal Hearing List');
    I.click(locate('//a').withText('Primary Health Tribunal Hearing List'));
    I.waitForText('Tribunal Hearing List for Primary Health');
    I.see('PRESTON');
    I.see('A Vs B');

    I.deletePublicationByArtefactId(artefactId);
});
