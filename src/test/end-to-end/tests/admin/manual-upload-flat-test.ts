import { getDateNowAndFuture, padFormatted } from '../../shared/shared-functions';
import { createLocation } from '../../shared/testingSupportApi';
import { randomData } from '../../shared/random-data';
import { config } from '../../../config';

Feature('Admin manual upload flat file');

const flatFileName = new DataTable(['flatFileName']);
flatFileName.add(['testFlatFile.pdf']);
flatFileName.add(['testFlatFile.docx']);

Data(flatFileName)
    .Scenario('I as a admin user should be able to upload flat file successfully', async ({ I, current }) => {
        const listType = 'Civil And Family Daily Cause List';
        const [date, dayAfter] = getDateNowAndFuture();
        const locationId = randomData.getRandomLocationId();
        const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
        await createLocation(locationId, locationName);

        I.loginAsAdmin();
        I.click('#card-manual-upload');
        I.waitForText('Manual upload');
        I.see('Manually upload a csv, doc, docx, htm, html, json, or pdf file, max size 2MB');
        I.attachFile('#manual-file-upload', './shared/mocks/' + current.flatFileName);
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
        I.see(current.flatFileName);
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
