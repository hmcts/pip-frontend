import { DateTime } from 'luxon';
import { createLocation, uploadPublication } from '../../shared/testingSupportApi';

Feature('SJP list download');

Scenario('I as a verified user should be able to download sjp public list', async ({ I }) => {
    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });
    const contentDate = DateTime.now().toFormat('dd MMMM yyyy');
    const sjpListToDownload = 'Single Justice Procedure Public List ' + contentDate;
    const locationId = '9';
    const locationName = 'Single Justice Procedure';

    await createLocation(locationId, locationName);
    const artefactId = await uploadPublication(
        'PUBLIC',
        locationId,
        displayFrom,
        displayTo,
        'ENGLISH',
        'sjp-public-list.json',
        'SJP_PUBLIC_LIST'
    );

    I.loginAsMediaUser();
    I.waitForText('Your account');
    I.see('Single Justice Procedure cases');
    I.click('#card-summary-of-publications\\?locationId\\=9');
    I.waitForText('What do you want to view from Single Justice Procedure?');
    I.see(sjpListToDownload);
    I.click(locate('//a').withText(sjpListToDownload));
    I.waitForText('Single Justice Procedure cases that are ready for hearing');
    I.see('Download a copy');
    I.click('Download a copy');
    I.waitForText('Terms and conditions');
    I.see(
        'As a verified user of the court and tribunal hearings service you are authorised to download this file containing personal protected data.'
    );
    I.see(
        'It is your responsibility to ensure you comply with any GDPR and/or reporting restrictions regarding the content of this file.'
    );
    I.see('Please tick this box to agree to the above terms and conditions');
    I.click('#disclaimer-agreement');
    I.click('Continue');
    I.waitForText('Download your file');
    I.see('Save your file somewhere you can find it. You may need to print it or show it to someone later.');
    I.see('If you have any questions, call 0300 303 0656.');

    I.handleDownloads(artefactId + '.pdf');
    I.click(locate('//a').withText('Download this PDF'));
    I.amInPath('../../../functional-output/functional/reports');
    I.seeFile(artefactId + '.pdf');

    I.handleDownloads(artefactId + '.xlsx');
    I.click(locate('//a').withText('Download this Microsoft Excel spreadsheet'));
    I.amInPath('../../../functional-output/functional/reports');
    I.seeFile(artefactId + '.xlsx');

    I.deletePublicationByArtefactId(artefactId.toString());
});

Scenario('I as a verified user should be able to download sjp press list', async ({ I }) => {
    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });
    const contentDate = DateTime.now().toFormat('dd MMMM yyyy');
    const sjpListToDownload = 'Single Justice Procedure Press List (Full List) ' + contentDate;
    const locationId = '9';
    const locationName = 'Single Justice Procedure';

    await createLocation(locationId, locationName);
    const artefactId = await uploadPublication(
        'PUBLIC',
        locationId,
        displayFrom,
        displayTo,
        'ENGLISH',
        'sjp-press-list.json',
        'SJP_PRESS_LIST'
    );

    I.loginAsMediaUser();
    I.waitForText('Your account');
    I.see('Single Justice Procedure cases');
    I.click('#card-summary-of-publications\\?locationId\\=9');
    I.waitForText('What do you want to view from Single Justice Procedure?');
    I.see(sjpListToDownload);
    I.click(locate('//a').withText(sjpListToDownload));
    I.waitForText('Single Justice Procedure cases - Press view (Full list)');
    I.see('Download a copy');
    I.click('Download a copy');
    I.waitForText('Terms and conditions');
    I.see(
        'As a verified user of the court and tribunal hearings service you are authorised to download this file containing personal protected data.'
    );
    I.see(
        'It is your responsibility to ensure you comply with any GDPR and/or reporting restrictions regarding the content of this file.'
    );
    I.see('Please tick this box to agree to the above terms and conditions');
    I.click('#disclaimer-agreement');
    I.click('Continue');
    I.waitForText('Download your file');
    I.see('Save your file somewhere you can find it. You may need to print it or show it to someone later.');
    I.see('If you have any questions, call 0300 303 0656.');

    I.handleDownloads(artefactId + '.pdf');
    I.click(locate('//a').withText('Download this PDF'));
    I.amInPath('../../../functional-output/functional/reports');
    I.seeFile(artefactId + '.pdf');

    I.handleDownloads(artefactId + '.xlsx');
    I.click(locate('//a').withText('Download this Microsoft Excel spreadsheet'));
    I.amInPath('../../../functional-output/functional/reports');
    I.seeFile(artefactId + '.xlsx');
    I.deletePublicationByArtefactId(artefactId.toString());
});
