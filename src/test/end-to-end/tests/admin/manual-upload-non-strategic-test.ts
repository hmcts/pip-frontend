import { getDateNowAndFuture, padFormatted } from '../../shared/shared-functions';
import { createLocation } from '../../shared/testingSupportApi';
import { randomData } from '../../shared/random-data';
import { config } from '../../../config';

Feature('Admin manual upload non strategic file');

const nonStrategicFileName = 'testExcelFile.xlsx';

Scenario('I as a admin user should be able to upload non strategic file successfully', async ({ I }) => {
    const listType = 'PHT Weekly Hearing List';
    const [date, dayAfter] = getDateNowAndFuture();
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
    await createLocation(locationId, locationName);

    I.loginAsSsoAdminLocal();
    I.click('#card-manual-upload\\?non-strategic\\=true');
    I.waitForText('Excel File Upload');
    I.see('Manually upload a excel file (.xlsx), max size 2MB');
    I.attachFile('#manual-file-upload', './shared/mocks/' + nonStrategicFileName);
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
    I.see(nonStrategicFileName);
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
    I.see('Primary Health Tribunal Weekly Hearing List for week commencing');
    I.logoutSsoAdminLocal();
});
