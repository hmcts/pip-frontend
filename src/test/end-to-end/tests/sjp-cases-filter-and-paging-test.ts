import { DateTime } from 'luxon';
import { uploadPublication } from '../shared/testingSupportApi';

Feature('Sjp List Filter And Paging');

Scenario('I should be able to view all the single procedure cases', async ({ I }) => {
    const contentDate = DateTime.now().plus({ months: 1 });
    const sjpList =
        'Single Justice Procedure Public List (Full List) ' + contentDate.toFormat('dd MMMM yyyy');
    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });
    const artefactId = await uploadPublication('PUBLIC', '9', contentDate.toISO({ includeOffset: false }), displayFrom, displayTo, 'ENGLISH','sjp-paging-and-filter.json',
        'SJP_PUBLIC_LIST');

    I.amOnPage('/');
    I.see('Court and tribunal hearings');
    I.click('Continue');
    I.waitForText('What do you want to do?');
    I.click(locate('//a').withText('Single Justice Procedure cases'));
    I.waitForText('What do you want to view from Single Justice Procedure?');
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
    I.fillField('#search-filters','A1')
    I.see('A1');
    I.click('Apply filters');

    I.deletePublicationByArtefactId(artefactId);
});
