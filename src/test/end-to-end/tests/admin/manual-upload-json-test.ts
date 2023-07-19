import { getDateNowAndFuture, padFormatted } from '../../shared/shared-functions';
import { createLocation } from '../../shared/testingSupportApi';
import { randomData } from '../../shared/random-data';
import { config } from '../../../config';

Feature('Admin manual upload JSON');

Scenario('I as a admin user should be able to upload json file successfully', async ({ I }) => {
    const listType = 'Civil And Family Daily Cause List';
    const fileName = 'civilAndFamilyDailyCauseList.json';
    const [date, dayAfter] = getDateNowAndFuture();
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();

    await createLocation(locationId, locationName);

    I.loginAsAdmin();
    I.click('#card-manual-upload');
    I.waitForText('Manual upload');
    I.see('Manually upload a csv, doc, docx, htm, html, json, or pdf file, max size 2MB');
    I.attachFile('#manual-file-upload', './shared/mocks/' + fileName);
    I.fillField('#search-input', locationName);
    I.selectOption('#listType', listType);

    I.fillField('#content-date-from-day', padFormatted(date.getDate()));
    I.fillField('#content-date-from-month', padFormatted(date.getMonth() + 1));
    I.fillField('#content-date-from-year', date.getFullYear());
    I.selectOption('#classification', 'Public');
    I.fillField('#display-date-from-day', padFormatted(date.getDate()));
    I.fillField('#display-date-from-month', padFormatted(date.getMonth() + 1));
    I.fillField('#display-date-from-year', date.getFullYear());
    I.fillField('#display-date-to-day', padFormatted(dayAfter.getDate()));
    I.fillField('#display-date-to-month', padFormatted(dayAfter.getMonth() + 1));
    I.fillField('#display-date-to-year', dayAfter.getFullYear());
    I.click('Continue');
    I.waitForText('Check upload details');
    I.see(locationName);
    I.see(listType);
    I.see(fileName);
    I.click('Confirm');
    I.waitForText('Success');
    I.see('Your file has been uploaded');

    I.click('Court and tribunal hearings');
    I.click('Continue');
    I.click('#view-choice');
    I.click('Continue');
    I.fillField('#search-input', locationName);
    I.click('Continue');
    I.waitForText('What do you want to view from ' + locationName);
    I.see('Civil and Family Daily Cause List');
    I.logout();
});

Scenario('I as a admin user should see proper error messages related to manual upload', async ({ I }) => {
    const listType = 'Civil And Family Daily Cause List';
    const fileName = 'civilAndFamilyDailyCauseList.json';
    const [date, dayAfter] = getDateNowAndFuture();
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();

    await createLocation(locationId, locationName);

    I.loginAsAdmin();
    I.click('#card-manual-upload');
    I.waitForText('Manual upload');
    I.see('Manually upload a csv, doc, docx, htm, html, json, or pdf file, max size 2MB');
    I.attachFile('#manual-file-upload', './shared/mocks/' + fileName);
    I.fillField('#search-input', locationName);
    I.fillField('#content-date-from-day', padFormatted(date.getDate()));
    I.fillField('#content-date-from-month', padFormatted(date.getMonth() + 1));
    I.fillField('#content-date-from-year', date.getFullYear());
    I.selectOption('#classification', 'Public');
    I.fillField('#display-date-from-day', padFormatted(date.getDate()));
    I.fillField('#display-date-from-month', padFormatted(date.getMonth() + 1));
    I.fillField('#display-date-from-year', date.getFullYear());
    I.fillField('#display-date-to-day', padFormatted(dayAfter.getDate()));
    I.fillField('#display-date-to-month', padFormatted(dayAfter.getMonth() + 1));
    I.fillField('#display-date-to-year', dayAfter.getFullYear());
    I.click('Continue');
    I.waitForText('Please select a list type');
    I.selectOption('#listType', listType);
    I.click('Continue');
    I.waitForText('Please provide a file');

    I.attachFile('#manual-file-upload', './shared/mocks/' + fileName);
    I.clearField('#search-input');
    I.pressKey('Backspace');
    I.click('Continue');
    I.waitForText('Court name must be three characters or more');
    I.see('Please select a sensitivity');

    I.fillField('#search-input', locationName);
    I.selectOption('#classification', 'Public');
    I.clearField('#content-date-from-day');
    I.pressKey('Backspace');
    I.click('Continue');
    I.waitForText('Please enter a valid date');
    I.fillField('#content-date-from-day', '123456');
    I.click('Continue');
    I.waitForText('Please enter a valid date');

    I.fillField('#content-date-from-day', padFormatted(date.getDate()));
    I.clearField('#content-date-from-month');
    I.pressKey('Backspace');
    I.click('Continue');
    I.waitForText('Please enter a valid date');
    I.fillField('#content-date-from-month', '123456');
    I.click('Continue');
    I.waitForText('Please enter a valid date');

    I.fillField('#content-date-from-month', padFormatted(date.getMonth() + 1));
    I.clearField('#content-date-from-year');
    I.pressKey('Backspace');
    I.click('Continue');
    I.waitForText('Please enter a valid date');
    I.fillField('#content-date-from-year', '123456');
    I.click('Continue');
    I.waitForText('Please enter a valid date');

    I.fillField('#content-date-from-year', date.getFullYear());
    I.clearField('#display-date-from-day');
    I.pressKey('Backspace');
    I.click('Continue');
    I.waitForText('Please enter a valid date');
    I.fillField('#display-date-from-day', '123456');
    I.click('Continue');
    I.waitForText('Please enter a valid date');

    I.fillField('#display-date-from-day', padFormatted(date.getDate()));
    I.clearField('#display-date-from-month');
    I.pressKey('Backspace');
    I.click('Continue');
    I.waitForText('Please enter a valid date');
    I.fillField('#display-date-from-month', '123456');
    I.click('Continue');
    I.waitForText('Please enter a valid date');

    I.fillField('#display-date-from-month', padFormatted(date.getMonth() + 1));
    I.clearField('#display-date-from-year');
    I.pressKey('Backspace');
    I.click('Continue');
    I.waitForText('Please enter a valid date');
    I.fillField('#display-date-from-year', '123456');
    I.click('Continue');
    I.waitForText('Please enter a valid date');

    I.fillField('#display-date-from-year', date.getFullYear());
    I.clearField('#display-date-to-day');
    I.pressKey('Backspace');
    I.click('Continue');
    I.waitForText('Please enter a valid date');
    I.fillField('#display-date-to-day', '123456');
    I.click('Continue');
    I.waitForText('Please enter a valid date');

    I.fillField('#display-date-to-day', padFormatted(dayAfter.getDate()));
    I.clearField('#display-date-to-month');
    I.pressKey('Backspace');
    I.click('Continue');
    I.waitForText('Please enter a valid date');
    I.fillField('#display-date-to-month', '123456');
    I.click('Continue');
    I.waitForText('Please enter a valid date');

    I.fillField('#display-date-to-month', padFormatted(dayAfter.getMonth() + 1));
    I.clearField('#display-date-to-year');
    I.pressKey('Backspace');
    I.click('Continue');
    I.waitForText('Please enter a valid date');
    I.fillField('#display-date-to-year', '123456');
    I.click('Continue');
    I.waitForText('Please enter a valid date');

    I.fillField('#display-date-from-day', padFormatted(dayAfter.getDate()));
    I.fillField('#display-date-from-month', padFormatted(dayAfter.getMonth() + 1));
    I.fillField('#display-date-from-year', dayAfter.getFullYear());
    I.fillField('#display-date-to-day', padFormatted(date.getDate()));
    I.fillField('#display-date-to-month', padFormatted(date.getMonth() + 1));
    I.fillField('#display-date-to-year', date.getFullYear());
    I.click('Continue');
    I.waitForText("Please make sure 'to' date is after 'from' date");

    I.fillField('#display-date-from-day', padFormatted(date.getDate()));
    I.fillField('#display-date-from-month', padFormatted(date.getMonth() + 1));
    I.fillField('#display-date-from-year', date.getFullYear());
    I.fillField('#display-date-to-day', padFormatted(dayAfter.getDate()));
    I.fillField('#display-date-to-month', padFormatted(dayAfter.getMonth() + 1));
    I.fillField('#display-date-to-year', dayAfter.getFullYear());
    I.attachFile('#manual-file-upload', './shared/mocks/' + fileName);
    I.selectOption('#listType', 'ET Daily List');
    I.selectOption('#classification', 'Public');
    I.click('Continue');
    I.waitForText('Check upload details');
    I.click('Confirm');
    I.waitForText('There is a problem');
    I.see('Unable to upload publication, please verify that provided fields are correct');
    I.logout();
});

Scenario('I as a admin user should be able to change the data before confirming upload', async ({ I }) => {
    const listType = 'Civil And Family Daily Cause List';
    const fileName = 'civilAndFamilyDailyCauseList.json';
    const [date, dayAfter] = getDateNowAndFuture();
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
    await createLocation(locationId, locationName);

    I.loginAsAdmin();
    I.click('#card-manual-upload');
    I.waitForText('Manual upload');
    I.see('Manually upload a csv, doc, docx, htm, html, json, or pdf file, max size 2MB');
    I.attachFile('#manual-file-upload', './shared/mocks/' + fileName);
    I.fillField('#search-input', 'Single Justice Procedure');
    I.selectOption('#listType', listType);

    I.fillField('#content-date-from-day', padFormatted(date.getDate()));
    I.fillField('#content-date-from-month', padFormatted(date.getMonth() + 1));
    I.fillField('#content-date-from-year', date.getFullYear());
    I.selectOption('#classification', 'Public');
    I.fillField('#display-date-from-day', padFormatted(date.getDate()));
    I.fillField('#display-date-from-month', padFormatted(date.getMonth() + 1));
    I.fillField('#display-date-from-year', date.getFullYear());
    I.fillField('#display-date-to-day', padFormatted(dayAfter.getDate()));
    I.fillField('#display-date-to-month', padFormatted(dayAfter.getMonth() + 1));
    I.fillField('#display-date-to-year', dayAfter.getFullYear());
    I.click('Continue');
    I.waitForText('Check upload details');

    I.click(locate('//dl/div').withText('Court name').find('a').withText('Change'));
    I.waitForText('Manual upload');
    I.fillField('#search-input', locationName);
    I.attachFile('#manual-file-upload', './shared/mocks/' + fileName);
    I.click('Continue');
    I.waitForText('Check upload details');
    I.see(locationName);

    I.click(locate('//dl/div').withText('File').find('a').withText('Change'));
    I.waitForText('Manual upload');
    I.attachFile('#manual-file-upload', './shared/mocks/' + fileName);
    I.click('Continue');
    I.waitForText('Check upload details');

    I.click(locate('//dl/div').withText('List type').find('a').withText('Change'));
    I.waitForText('Manual upload');
    I.attachFile('#manual-file-upload', './shared/mocks/' + fileName);
    I.click('Continue');
    I.waitForText('Check upload details');

    I.click(locate('//dl/div').withText('Hearing start date').find('a').withText('Change'));
    I.waitForText('Manual upload');
    I.attachFile('#manual-file-upload', './shared/mocks/' + fileName);
    I.click('Continue');
    I.waitForText('Check upload details');

    I.click(locate('//dl/div').withText('Sensitivity').find('a').withText('Change'));
    I.waitForText('Manual upload');
    I.selectOption('#classification', 'Private');
    I.attachFile('#manual-file-upload', './shared/mocks/' + fileName);
    I.click('Continue');
    I.waitForText('Check upload details');

    I.click(locate('//dl/div').withText('Language').find('a').withText('Change'));
    I.waitForText('Manual upload');
    I.attachFile('#manual-file-upload', './shared/mocks/' + fileName);
    I.selectOption('#language', 'Welsh');
    I.click('Continue');
    I.waitForText('Check upload details');

    I.click(locate('//dl/div').withText('Display file dates').find('a').withText('Change'));
    I.waitForText('Manual upload');
    I.attachFile('#manual-file-upload', './shared/mocks/' + fileName);
    I.click('Continue');
    I.waitForText('Check upload details');
    I.logout();
});
