import { DateTime } from 'luxon';
import { createLocation, uploadPublication } from '../../shared/testingSupportApi';
import { randomData } from '../../shared/random-data';
import { config } from '../../../config';

Feature('SJP list download');

Scenario('I as a verified user should be able to search and download sjp public list', async ({ I }) => {
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
    await createLocation(locationId, locationName);

    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });
    const contentDate = DateTime.now().plus({ months: 1 });
    const sjpListToDownload =
        'Single Justice Procedure Public List (Full List) ' + contentDate.toFormat('dd MMMM yyyy');

    const artefactId = await uploadPublication(
        'PUBLIC',
        locationId,
        contentDate.toISO({ includeOffset: false }),
        displayFrom,
        displayTo,
        'ENGLISH',
        'sjp-public-list.json',
        'SJP_PUBLIC_LIST'
    );

    I.loginAsMediaUser();
    I.click('#card-search');
    I.see('What court or tribunal are you interested in?');
    I.fillField('#search-input', locationName);
    I.click('Continue');
    I.waitForText('What do you want to view from ' + locationName);
    I.see(sjpListToDownload);
    I.click(locate('//a').withText(sjpListToDownload));
    I.waitForText('Single Justice Procedure cases that are ready for hearing (Full list)');

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
});

Scenario('I as a verified user should be able to download sjp press list', async ({ I }) => {
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
    await createLocation(locationId, locationName);

    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });
    const contentDate = DateTime.now().plus({ months: 1 });
    const sjpListToDownload = 'Single Justice Procedure Press List (Full List) ' + contentDate.toFormat('dd MMMM yyyy');

    const artefactId = await uploadPublication(
        'PUBLIC',
        locationId,
        contentDate.toISO({ includeOffset: false }),
        displayFrom,
        displayTo,
        'ENGLISH',
        'sjp-press-list.json',
        'SJP_PRESS_LIST'
    );

    I.loginAsMediaUser();
    I.click('#card-search');
    I.see('What court or tribunal are you interested in?');
    I.fillField('#search-input', locationName);
    I.click('Continue');
    I.waitForText('What do you want to view from ' + locationName);
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
});
