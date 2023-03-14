import { padFormatted } from '../shared/shared-functions';

Feature('Delete Location');

const LOCATION_NAME = 'Test Court1';

Scenario(
    'I as a system admin should be able to delete court only when there are no active subscriptions or artefacts',
    async ({ I }) => {
        const date = new Date();
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 1);

        I.loginAsSystemAdmin();
        I.click('#card-manual-reference-data-upload');
        I.attachFile('#manual-reference-data-upload', './shared/mocks/delete-court-validations.csv');
        I.click('Continue');
        I.click('Confirm');
        I.waitForText('Your file has been uploaded');

        I.click('Upload');
        I.attachFile('#manual-file-upload', '../unit/mocks/crownWarnedList.json');
        I.fillField('#search-input', LOCATION_NAME);
        I.selectOption('#listType', 'Crown Warned List');
        I.fillField('#content-date-from-day', padFormatted(date.getDate()));
        I.fillField('#content-date-from-month', padFormatted(date.getMonth() + 1));
        I.fillField('#content-date-from-year', date.getFullYear());
        I.fillField('#display-date-from-day', padFormatted(date.getDate()));
        I.fillField('#display-date-from-month', padFormatted(date.getMonth() + 1));
        I.fillField('#display-date-from-year', date.getFullYear());

        I.fillField('#display-date-to-day', padFormatted(dayAfter.getDate()));
        I.fillField('#display-date-to-month', padFormatted(dayAfter.getMonth() + 1));
        I.fillField('#display-date-to-year', dayAfter.getFullYear());
        I.click('Continue');
        I.click('Confirm');
        I.waitForText('Your file has been uploaded');
        I.click('Sign out');

        I.loginAsMediaUser();
        I.click('Email subscriptions');
        I.click('Add email subscription');
        I.click('#subscription-choice-4');
        I.click('Continue');
        I.checkOption('//*[@id="100"]');
        I.click('Continue');
        I.click('Confirm Subscriptions');
        I.waitForText('Your subscription(s) has been added successfully');
        I.click('Sign out');

        I.loginAsSystemAdmin();
        I.click('Delete Court');
        I.fillField('#search-input', LOCATION_NAME);
        I.click('Continue');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('There are active artefacts for the given location.');
        I.click('Click here to delete all the artefact(s) for ' + LOCATION_NAME);
        I.waitForText('Are you sure you want to delete all the publications?');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('Success');
        I.see('Court publication(s) has been deleted');

        I.click('Continue deletion of ' + LOCATION_NAME);
        I.waitForText('Are you sure you want to delete this court?');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('There are active subscriptions for the given location.');
        I.click('Click here to delete all the subscription(s) for ' + LOCATION_NAME);
        I.waitForText('Are you sure you want to delete all the subscriptions?');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('Success');
        I.see('Court subscription(s) has been deleted');

        I.click('Continue deletion of ' + LOCATION_NAME);
        I.waitForText('Are you sure you want to delete this court?');
        I.click('#delete-choice');
        I.click('Continue');
        I.waitForText('Success');
        I.see('Court has been deleted');
    }
);
