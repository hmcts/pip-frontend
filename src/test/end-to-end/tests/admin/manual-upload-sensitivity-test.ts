import Assert from 'assert';
import { getDateNowAndFuture, padFormatted } from '../../shared/shared-functions';

Feature('Admin manual upload sensitivity');

Scenario('Manual upload sensitivity test', async ({ I }) => {
    const classificationId = '#classification';
    const listTypeId = '#listType';
    const sensitivityClassified = 'CLASSIFIED';
    const sensitivityPrivate = 'PRIVATE';
    const [date, dayAfter] = getDateNowAndFuture();

    I.loginAsAdmin();
    I.click('#card-manual-upload');
    I.selectOption(listTypeId, 'SJP Press List (Full list)');

    let classification = await I.grabValueFrom(classificationId);
    Assert.equal(classification, sensitivityClassified);

    I.selectOption(listTypeId, 'SJP Press Register');

    classification = await I.grabValueFrom(classificationId);
    Assert.equal(classification, sensitivityClassified);

    I.selectOption(listTypeId, 'SJP Public List');

    classification = await I.grabValueFrom(classificationId);
    Assert.equal(classification, '');

    I.selectOption(listTypeId, 'Crown Warned List');

    classification = await I.grabValueFrom(classificationId);
    Assert.equal(classification, sensitivityPrivate);

    I.selectOption(listTypeId, 'Magistrates Standard List');

    classification = await I.grabValueFrom(classificationId);
    Assert.equal(classification, sensitivityPrivate);

    I.selectOption(listTypeId, 'Crown Firm List');

    classification = await I.grabValueFrom(classificationId);
    Assert.equal(classification, sensitivityPrivate);

    I.attachFile('#manual-file-upload', '../unit/mocks/crownWarnedList.json');
    I.fillField('#search-input', 'Single Justice Procedure');
    I.selectOption(listTypeId, 'Crown Warned List');

    I.fillField('#content-date-from-day', padFormatted(date.getDate()));
    I.fillField('#content-date-from-month', padFormatted(date.getMonth() + 1));
    I.fillField('#content-date-from-year', date.getFullYear());
    I.selectOption(classificationId, 'Public');
    I.fillField('#display-date-from-day', padFormatted(date.getDate()));
    I.fillField('#display-date-from-month', padFormatted(date.getMonth() + 1));
    I.fillField('#display-date-from-year', date.getFullYear());
    I.fillField('#display-date-to-day', padFormatted(dayAfter.getDate()));
    I.fillField('#display-date-to-month', padFormatted(dayAfter.getMonth() + 1));
    I.fillField('#display-date-to-year', dayAfter.getFullYear());
    I.click('Continue');
    I.see(
        'Please ensure you have checked the sensitivity of the list you are about to publish, the data contained within it and the consequences if this is published incorrectly.'
    );
    I.logout();
}).tag('@CrossBrowser');
