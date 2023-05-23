import { DateTime } from 'luxon';
import { uploadPublication } from '../../shared/testingSupportApi';

Feature('Verified user single Justice Procedure cases');

Scenario('I as a verified user should be able to view all the single procedure cases', async ({ I }) => {
    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });
    const artefactId = await uploadPublication('PUBLIC', '9', displayFrom, displayTo, 'ENGLISH');

    I.loginAsMediaUser();
    I.waitForText('Your account');
    I.see('Single Justice Procedure cases');
    I.see(
        'Cases ready to be decided by a magistrate without a hearing. Includes TV licensing, minor traffic offences such as speeding and more.'
    );
    I.click('#card-summary-of-publications\\?locationId\\=9');
    I.waitForText('What do you want to view from Single Justice Procedure?');
    I.see('Civil and Family Daily Cause List');
    I.click(locate('//a').withText('Civil and Family Daily Cause List'));
    I.waitForText('Civil and Family Daily Cause List for Single Justice Procedure');
    I.see('12345678');
    I.see('A1 Vs B1');

    I.click('Home');
    I.click('#card-search');
    I.see('What court or tribunal are you interested in?');
    I.fillField('#search-input', 'Single Justice Procedure');
    I.click('Continue');
    I.waitForText('What do you want to view from Single Justice Procedure?');
    I.see('Civil and Family Daily Cause List');
    I.click(locate('//a').withText('Civil and Family Daily Cause List'));
    I.waitForText('Civil and Family Daily Cause List for Single Justice Procedure');
    I.see('12345678');
    I.see('A1 Vs B1');
    I.logout();

    I.deletePublicationByArtefactId(artefactId);
});
