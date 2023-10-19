import { DateTime } from 'luxon';
import { uploadPublication } from '../shared/testingSupportApi';

Feature('Single Justice Procedure cases');

Scenario('I should be able to view all the single procedure cases', async ({ I }) => {
    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });
    const artefactId = await uploadPublication('PUBLIC', '9', displayFrom, displayTo, 'ENGLISH','primaryHealthList.json',
        'PRIMARY_HEALTH_LIST');

    I.amOnPage('/');
    I.see('Court and tribunal hearings');
    I.click('Continue');
    I.waitForText('What do you want to do?');
    I.click(locate('//a').withText('Single Justice Procedure cases'));
    I.waitForText('What do you want to view from Single Justice Procedure?');
    I.see('Primary Health Tribunal Hearing List');
    I.click(locate('//a').withText('Primary Health Tribunal Hearing List'));
    I.waitForText('Tribunal Hearing List for Primary Health');
    I.see('PRESTON');
    I.see('A Vs B');

    I.deletePublicationByArtefactId(artefactId);
});
