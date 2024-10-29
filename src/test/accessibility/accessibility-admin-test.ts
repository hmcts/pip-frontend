import { randomData } from '../end-to-end/shared/random-data';
import { config as testConfig, config } from '../config';
import { clearTestData, createLocation} from '../end-to-end/shared/testingSupportApi';
import { getDateNowAndFuture, padFormatted } from '../end-to-end/shared/shared-functions';

Feature('accessibility_admin_tests');
const listType = 'Civil And Family Daily Cause List';
const fileName = 'civilAndFamilyDailyCauseList.json';
const invalidFileName = 'invalidEtDailyList.json';
const [date, dayAfter] = getDateNowAndFuture();
const locationId = randomData.getRandomLocationId();
const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
const testFullName = testConfig.TEST_SUITE_PREFIX + randomData.getRandomString() + ' Surname';
const emailTestMediaAccount = randomData.getRandomEmailAddress();
const TEST_EMPLOYER = 'HMCTS';

BeforeSuite(async () => {
    await createLocation(locationId, locationName);
});

Before(({ I }) => {
    // or Background
    I.loginAsAdmin();
});

Scenario('Admin User Journey - admin-dashboard-page', async ({ I }) => {
    I.amOnPage('/admin-dashboard');
    I.checkA11y('admin-dashboard-a11y-audit.html');
});

Scenario('Admin User Journey - manual-upload-page', async ({ I }) => {
    I.amOnPage('/manual-upload');
    I.checkA11y('manual-upload-a11y-audit.html');
});

Scenario('Admin User Journey - manual-upload-error-page', async ({ I }) => {
    I.amOnPage('/manual-upload');
    I.waitForText('Manual upload');
    I.click('Continue');
    I.waitForText('Please provide a file');
    I.checkA11y('manual-upload-error-a11y-audit.html');
});

Scenario('Admin User Journey - manual-upload-summary-page', async ({ I }) => {
    I.amOnPage('/manual-upload');
    I.waitForText('Manual upload');
    I.attachFile('#manual-file-upload', '../end-to-end/shared/mocks/' + fileName);
    I.fillField('#search-input', locationName);
    I.selectOption('#listType', listType);

    // Set a specific content date of 12/31/2020 so the request to Courtel can be identified.
    const contentDate = new Date(2020, 11, 31);
    I.fillField('#content-date-from-day', padFormatted(contentDate.getDate()));
    I.fillField('#content-date-from-month', padFormatted(contentDate.getMonth() + 1));
    I.fillField('#content-date-from-year', contentDate.getFullYear());
    I.selectOption('#classification', 'Public');
    I.fillField('#display-date-from-day', padFormatted(date.getDate()));
    I.fillField('#display-date-from-month', padFormatted(date.getMonth() + 1));
    I.fillField('#display-date-from-year', date.getFullYear());
    I.fillField('#display-date-to-day', padFormatted(dayAfter.getDate()));
    I.fillField('#display-date-to-month', padFormatted(dayAfter.getMonth() + 1));
    I.fillField('#display-date-to-year', dayAfter.getFullYear());
    I.click('Continue');
    I.waitForText('Check upload details');
    I.checkA11y('manual-upload-summary-a11y-audit.html');
});

Scenario('Admin User Journey - manual-upload-confirmation-page', async ({ I }) => {
    I.amOnPage('/manual-upload');
    I.waitForText('Manual upload');
    I.attachFile('#manual-file-upload', '../end-to-end/shared/mocks/' + fileName);
    I.fillField('#search-input', locationName);
    I.selectOption('#listType', listType);

    // Set a specific content date of 12/31/2020 so the request to Courtel can be identified.
    const contentDate = new Date(2020, 11, 31);
    I.fillField('#content-date-from-day', padFormatted(contentDate.getDate()));
    I.fillField('#content-date-from-month', padFormatted(contentDate.getMonth() + 1));
    I.fillField('#content-date-from-year', contentDate.getFullYear());
    I.selectOption('#classification', 'Public');
    I.fillField('#display-date-from-day', padFormatted(date.getDate()));
    I.fillField('#display-date-from-month', padFormatted(date.getMonth() + 1));
    I.fillField('#display-date-from-year', date.getFullYear());
    I.fillField('#display-date-to-day', padFormatted(dayAfter.getDate()));
    I.fillField('#display-date-to-month', padFormatted(dayAfter.getMonth() + 1));
    I.fillField('#display-date-to-year', dayAfter.getFullYear());
    I.click('Continue');
    I.waitForText('Check upload details');
    I.click('Confirm');
    I.waitForText('Success');
    I.checkA11y('manual-upload-confirmation-a11y-audit.html');
});

Scenario('Admin User Journey - manual-upload-confirmation-error-page', async ({ I }) => {
    I.amOnPage('/manual-upload');
    I.waitForText('Manual upload');
    I.attachFile('#manual-file-upload', '../end-to-end/shared/mocks/' + invalidFileName);
    I.fillField('#search-input', locationName);
    I.selectOption('#listType', listType);

    // Set a specific content date of 12/31/2020 so the request to Courtel can be identified.
    const contentDate = new Date(2020, 11, 31);
    I.fillField('#content-date-from-day', padFormatted(contentDate.getDate()));
    I.fillField('#content-date-from-month', padFormatted(contentDate.getMonth() + 1));
    I.fillField('#content-date-from-year', contentDate.getFullYear());
    I.selectOption('#classification', 'Public');
    I.fillField('#display-date-from-day', padFormatted(date.getDate()));
    I.fillField('#display-date-from-month', padFormatted(date.getMonth() + 1));
    I.fillField('#display-date-from-year', date.getFullYear());
    I.fillField('#display-date-to-day', padFormatted(dayAfter.getDate()));
    I.fillField('#display-date-to-month', padFormatted(dayAfter.getMonth() + 1));
    I.fillField('#display-date-to-year', dayAfter.getFullYear());
    I.click('Continue');
    I.waitForText('Check upload details');
    I.click('Confirm');
    I.waitForText('There is a problem');
    I.checkA11y('manual-upload-confirmation-error-a11y-audit.html');
});

Scenario('Admin User Journey - remove-list-search-page', async ({ I }) => {
    I.amOnPage('/remove-list-search');
    I.checkA11y('remove-list-search-a11y-audit.html');
});

Scenario('Admin User Journey - remove-list-search-error-page', async ({ I }) => {
    I.amOnPage('/remove-list-search');
    I.waitForText('Find content to remove');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.checkA11y('remove-list-search-error-a11y-audit.html');
});

Scenario('Admin User Journey - remove-list-search-results-page', async ({ I }) => {
    I.amOnPage('/remove-list-search-results?locationId=' + locationId);
    I.checkA11y('remove-list-search-results-a11y-audit.html');
});

Scenario('Admin User Journey - remove-list-search-results-error-page', async ({ I }) => {
    I.amOnPage('/remove-list-search-results?locationId=' + locationId);
    I.waitForText('Select content to remove');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.checkA11y('remove-list-search-results-error-a11y-audit.html');
});

Scenario('Admin User Journey - remove-list-confirmation-page', async ({ I }) => {
    I.amOnPage('/remove-list-search-results?locationId=' + locationId);
    I.click(locate('//tr').withText(listType).find('.govuk-checkboxes__input'));
    I.click('Continue');
    I.waitForText('Are you sure you want to remove this content?');
    I.checkA11y('remove-list-confirmation-a11y-audit.html');
});

Scenario('Admin User Journey - remove-list-confirmation-error-page', async ({ I }) => {
    I.amOnPage('/remove-list-search-results?locationId=' + locationId);
    I.click(locate('//tr').withText(listType).find('.govuk-checkboxes__input'));
    I.click('Continue');
    I.waitForText('Are you sure you want to remove this content?');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.checkA11y('remove-list-confirmation-error-a11y-audit.html');
});

Scenario('Admin User Journey - remove-list-confirmation-page', async ({ I }) => {
    I.amOnPage('/remove-list-search-results?locationId=' + locationId);
    I.click(locate('//tr').withText(listType).find('.govuk-checkboxes__input'));
    I.click('Continue');
    I.waitForText('Are you sure you want to remove this content?');
    I.see(listType);
    I.click('#remove-choice');
    I.click('Continue');
    I.waitForText('Success');
    I.checkA11y('remove-list-confirmation-a11y-audit.html');
});

Scenario('Admin User Journey - media-applications-page', async ({ I }) => {
    I.logout();
    I.amOnPage('/');
    I.waitForText('Court and tribunal hearings');
    I.click('Continue');
    I.click('Sign in');
    I.waitForText("Don't have an account?");
    I.click('Create a Court and tribunal hearings account');
    I.waitForText('Create a Court and tribunal hearings account');
    I.fillField('#fullName', testFullName);
    I.fillField('#emailAddress', emailTestMediaAccount);
    I.fillField('#employer', TEST_EMPLOYER);
    I.attachFile('file-upload', '../end-to-end/shared/mocks/testFile.pdf');
    I.click('#tcbox');
    I.click('Continue');
    I.waitForText('Details submitted');
    I.loginAsAdmin();
    I.amOnPage('/media-applications');
    I.checkA11y('media-applications-a11y-audit.html');
});

Scenario('Admin User Journey - media-account-review-page', async ({ I }) => {
    I.amOnPage('/media-applications');
    I.waitForText('Select application to assess');
    I.click(locate('//tr').withText(testFullName).find('a').withText('View'));
    I.waitForText("Applicant's details");
    I.checkA11y('media-account-review-a11y-audit.html');
});

Scenario('Admin User Journey - media-account-review-image-page', async ({ I }) => {
    I.amOnPage('/media-applications');
    I.waitForText('Select application to assess');
    I.click(locate('//tr').withText(testFullName).find('a').withText('View'));
    I.waitForText("Applicant's details");
    I.click(locate('//div').withText('Proof of ID').find('a').withText('View'));
    I.checkA11y('media-account-review-image-a11y-audit.html');
});

Scenario('Admin User Journey - media-account-approval-page', async ({ I }) => {
    I.amOnPage('/media-applications');
    I.waitForText('Select application to assess');
    I.click(locate('//tr').withText(testFullName).find('a').withText('View'));
    I.waitForText("Applicant's details");
    I.click('#approve');
    I.waitForText('Are you sure you want to approve this application?');
    I.checkA11y('media-account-approval-a11y-audit.html');
});

Scenario('Admin User Journey - media-account-approval-error-page', async ({ I }) => {
    I.amOnPage('/media-applications');
    I.waitForText('Select application to assess');
    I.click(locate('//tr').withText(testFullName).find('a').withText('View'));
    I.waitForText("Applicant's details");
    I.click('#approve');
    I.waitForText('Are you sure you want to approve this application?');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.checkA11y('media-account-approval-error-a11y-audit.html');
});

Scenario('Admin User Journey - media-account-approval-confirmation-page', async ({ I }) => {
    I.amOnPage('/media-applications');
    I.waitForText('Select application to assess');
    I.click(locate('//tr').withText(testFullName).find('a').withText('View'));
    I.waitForText("Applicant's details");
    I.click('#approve');
    I.waitForText('Are you sure you want to approve this application?');
    I.click('#yes');
    I.click('Continue');
    I.waitForText('Application has been approved');
    I.checkA11y('media-account-approval-confirmation-a11y-audit.html');
});

AfterSuite(async () => {
    await clearTestData();
});
