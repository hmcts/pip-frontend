import { randomData } from '../end-to-end/shared/random-data';
import { config as testConfig, config } from '../config';
import {
    clearTestData,
    createLocation,
    createSubscription,
    createTestUserAccount,
    createThirdPartyUserAccount,
    deleteThirdPartyUserAccount,
    uploadPublication,
} from '../end-to-end/shared/testingSupportApi';
import { DateTime } from 'luxon';

Feature('accessibility_system_admin_tests');

const LOCATION_ID = randomData.getRandomLocationId();
const LOCATION_NAME = config.TEST_SUITE_PREFIX + randomData.getRandomString();
const DISPLAY_FROM = DateTime.now().toISO({ includeOffset: false });
const DISPLAY_TO = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });
const TEST_USER_EMAIL = randomData.getRandomEmailAddress();
const TEST_PROVENANCE_USER_ID = testConfig.TEST_SUITE_PREFIX + randomData.getRandomString();
let thirdPartyUserId;
let testUser;
let artefactId;

const CSV_FILE_PATH = '../end-to-end/shared/mocks/system-admin-upload-reference-data-test.csv';
const BULK_CREATE_USER_FILE_PATH = '../end-to-end/shared/mocks/bulkCreateUser.csv';
const INVALID_FILE_PATH = '../end-to-end/shared/mocks/reference-data-invalid.csv';
const TEST_FIRST_NAME = testConfig.TEST_SUITE_PREFIX + 'FirstName';
const TEST_LAST_NAME = testConfig.TEST_SUITE_PREFIX + 'Surname';

BeforeSuite(async () => {
    testUser = await createTestUserAccount(TEST_FIRST_NAME, TEST_LAST_NAME, TEST_USER_EMAIL);
    thirdPartyUserId = await createThirdPartyUserAccount(TEST_PROVENANCE_USER_ID);
    await createLocation(LOCATION_ID, LOCATION_NAME);
    artefactId = await uploadPublication(
        'PUBLIC',
        LOCATION_ID,
        DISPLAY_FROM,
        DISPLAY_FROM,
        DISPLAY_TO,
        'ENGLISH',
        'etDailyList.json',
        'ET_DAILY_LIST'
    );
    await createSubscription(LOCATION_ID, LOCATION_NAME, testUser['userId'] as string);
});

Before(({ I }) => {
    I.loginAsSsoSystemAdmin();
});

Scenario('System Admin User Journey - system-admin-dashboard-page', async ({ I }) => {
    I.amOnPage('/system-admin-dashboard');
    I.checkA11y('system-admin-dashboard-a11y-audit.html');
});

//Upload Reference Data

Scenario('System Admin User Journey - reference-data-upload-page', async ({ I }) => {
    I.amOnPage('/reference-data-upload');
    I.checkA11y('reference-data-upload-a11y-audit.html');
});

Scenario('System Admin User Journey - reference-data-upload-summary-page', async ({ I }) => {
    I.amOnPage('/reference-data-upload');
    I.waitForText('Manually upload a csv file');
    I.attachFile('#reference-data-upload', CSV_FILE_PATH);
    I.click('Continue');
    I.waitForText('Check upload details');
    I.checkA11y('reference-data-upload-summary-a11y-audit.html');
});

Scenario('System Admin User Journey - reference-data-upload-check-details-page', async ({ I }) => {
    I.amOnPage('/reference-data-upload');
    I.waitForText('Manually upload a csv file');
    I.attachFile('#reference-data-upload', CSV_FILE_PATH);
    I.click('Continue');
    I.waitForText('Check upload details');
    I.checkA11y('reference-data-upload-check-details-a11y-audit.html');
});

Scenario('System Admin User Journey - reference-data-upload-confirmation-page', async ({ I }) => {
    I.amOnPage('/reference-data-upload');
    I.waitForText('Manually upload a csv file');
    I.attachFile('#reference-data-upload', CSV_FILE_PATH);
    I.click('Continue');
    I.waitForText('Check upload details');
    I.click('Confirm');
    I.waitForText('Success');
    I.checkA11y('reference-data-upload-confirmation-a11y-audit.html');
});

Scenario('System Admin User Journey - reference-data-no-file-error--page', async ({ I }) => {
    I.amOnPage('/reference-data-upload');
    I.waitForText('Manually upload a csv file');
    I.click('Continue');
    I.waitForText('Please provide a file');
    I.checkA11y('reference-data-no-file-a11y-audit.html');
});

Scenario('System Admin User Journey - reference-data-upload-error--page', async ({ I }) => {
    I.amOnPage('/reference-data-upload');
    I.waitForText('Manually upload a csv file');
    I.attachFile('#reference-data-upload', INVALID_FILE_PATH);
    I.click('Continue');
    I.waitForText('Check upload details');
    I.click('Confirm');
    I.waitForText('There is a problem');
    I.checkA11y('reference-data-upload-error-a11y-audit.html');
});

//Delete Court

Scenario('System Admin User Journey - delete-court-reference-data-page', async ({ I }) => {
    I.amOnPage('/delete-court-reference-data');
    I.waitForText('Find the court to remove');
    I.checkA11y('delete-court-reference-data-a11y-audit.html');
});

Scenario('System Admin User Journey - delete-court-reference-data-confirmation-page', async ({ I }) => {
    I.amOnPage('/delete-court-reference-data-confirmation?locationId=' + LOCATION_ID);
    I.waitForText('Are you sure you want to delete this court?');
    I.checkA11y('delete-court-reference-data-confirmation-a11y-audit.html');
});

Scenario('System Admin User Journey - delete-court-reference-data-confirmation-error-page', async ({ I }) => {
    I.amOnPage('/delete-court-reference-data-confirmation?locationId=' + LOCATION_ID);
    I.waitForText('Are you sure you want to delete this court?');
    I.click('#delete-choice');
    I.click('Continue', null, { noWaitAfter: true });
    I.waitForText('There is a problem');
    I.checkA11y('delete-court-reference-data-confirmation-error-a11y-audit.html');
});

Scenario('System Admin User Journey - delete-court-reference-data-error-page', async ({ I }) => {
    I.amOnPage('/delete-court-reference-data');
    I.waitForText('Find the court to remove');
    I.click('Continue', null, { noWaitAfter: true });
    I.waitForText('There is a problem');
    I.checkA11y('delete-court-reference-data-error-a11y-audit.html');
});

Scenario('System Admin User Journey - delete-court-reference-data-success-page', async ({ I }) => {
    I.amOnPage('/delete-court-reference-data-success');
    I.waitForText('Success');
    I.checkA11y('delete-court-reference-data-success-a11y-audit.html');
});

//Manage Third-Party Users

Scenario('System Admin User Journey - manage-third-party-users-page', async ({ I }) => {
    I.amOnPage('/manage-third-party-users');
    I.waitForText('Manage third party users');
    I.checkA11y('manage-third-party-users-a11y-audit.html');
});

Scenario('System Admin User Journey - manage-third-party-user-view-page', async ({ I }) => {
    I.amOnPage('/manage-third-party-users/view?userId=' + thirdPartyUserId);
    I.waitForText('Manage user');
    I.checkA11y('manage-third-party-user_view-a11y-audit.html');
});

Scenario('System Admin User Journey - manage-third-party-user-subscription-page', async ({ I }) => {
    I.amOnPage('/manage-third-party-users/subscriptions?userId=' + thirdPartyUserId);
    I.waitForText('Manage third party subscriptions');
    I.checkA11y('manage-third-party-user_subscription-a11y-audit.html');
});

Scenario('System Admin User Journey - manage-third-party-user_subscription-updated-page', async ({ I }) => {
    I.amOnPage('/manage-third-party-users/subscriptions?userId=' + thirdPartyUserId);
    I.waitForText('Manage third party subscriptions');
    I.click('Save subscriptions');
    I.waitForText('Third Party Subscriptions Updated');
    I.checkA11y('manage-third-party-user_subscription_updated-a11y-audit.html');
});

Scenario('System Admin User Journey - delete-third-party-user-confirmation-page', async ({ I }) => {
    I.amOnPage('/delete-third-party-user-confirmation?userId=' + thirdPartyUserId);
    I.waitForText('Are you sure you want to delete ' + TEST_PROVENANCE_USER_ID + '?');
    I.checkA11y('delete-third-party-user-confirmation-a11y-audit.html');
});

Scenario('System Admin User Journey - delete-third-party-user-success-page', async ({ I }) => {
    I.amOnPage('/delete-third-party-user-success');
    I.waitForText('Third party user deleted');
    I.checkA11y('delete-third-party-user-success-a11y-audit.html');
});

Scenario('System Admin User Journey - create-third-party-user-page', async ({ I }) => {
    I.amOnPage('/create-third-party-user');
    I.waitForText('Create third party user');
    I.checkA11y('create-third-party-user-a11y-audit.html');
});

Scenario('System Admin User Journey - create-third-party-user-error-page', async ({ I }) => {
    I.amOnPage('/create-third-party-user');
    I.waitForText('Create third party user');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.checkA11y('create-third-party-user-error-a11y-audit.html');
});

Scenario('System Admin User Journey - create-third-party-user-summary-page', async ({ I }) => {
    I.amOnPage('/create-third-party-user');
    I.waitForText('Create third party user');
    I.click('#thirdPartyName');
    I.fillField('#thirdPartyName', 'some name');
    I.click('#thirdPartyRole');
    I.click('Continue');
    I.waitForText('Create third party user summary');
    I.checkA11y('create-third-party-user-summary-a11y-audit.html');
});

Scenario('System Admin User Journey - create-third-party-user-exists-error-page', async ({ I }) => {
    I.amOnPage('/create-third-party-user');
    I.waitForText('Create third party user');
    I.click('#thirdPartyName');
    I.fillField('#thirdPartyName', TEST_PROVENANCE_USER_ID);
    I.click('#thirdPartyRole');
    I.click('Continue');
    I.waitForText('Create third party user summary');
    I.click('Confirm');
    I.waitForText('Failed to create third party user. It is possible that the user already exists.');
    I.checkA11y('create-third-party-user-exists-error-a11y-audit.html');
});

Scenario('System Admin User Journey - create-third-party-user-success-page', async ({ I }) => {
    I.amOnPage('/create-third-party-user-success');
    I.waitForText('Third party user created');
    I.checkA11y('create-third-party-user-success-a11y-audit.html');
});

//User Management

Scenario('System Admin User Journey - user-management-page', async ({ I }) => {
    I.amOnPage('/user-management');
    I.waitForText('Find, update and delete a user');
    I.checkA11y('user-management-a11y-audit.html');
});

Scenario('System Admin User Journey - user-management-filter-error-page', async ({ I }) => {
    I.amOnPage('/user-management');
    I.waitForText('Find, update and delete a user');
    I.fillField('#email', 'invalid-email');
    I.click('Apply filters');
    I.waitForText('There is a problem');
    I.checkA11y('user-management-filter-error-a11y-audit.html');
});

Scenario('System Admin User Journey - manage-user-page', async ({ I }) => {
    I.amOnPage(('/manage-user?id=' + testUser['userId']) as string);
    I.waitForText('Ensure authorisation has been granted before updating this user');
    I.checkA11y('manage-user-a11y-audit.html');
});

Scenario('System Admin User Journey - user-delete-confirmation-page', async ({ I }) => {
    I.amOnPage(('/manage-user?id=' + testUser['userId']) as string);
    I.waitForText('Ensure authorisation has been granted before updating this user');
    I.click('Delete user');
    I.waitForText('Are you sure you want to delete ' + TEST_USER_EMAIL + '?');
    I.checkA11y('user-delete-confirmation-a11y-audit.html');
});

Scenario('System Admin User Journey - user-delete-success-page', async ({ I }) => {
    I.amOnPage(('/manage-user?id=' + testUser['userId']) as string);
    I.waitForText('Ensure authorisation has been granted before updating this user');
    I.click('Delete user');
    I.waitForText('Are you sure you want to delete ' + TEST_USER_EMAIL + '?');
    I.click('Yes');
    I.click('Continue');
    I.waitForText('User Deleted');
    I.checkA11y('user-delete-success-a11y-audit.html');
});

//Blob Explorer

Scenario('System Admin User Journey - blob-view-locations-page', ({ I }) => {
    I.amOnPage('/blob-view-locations');
    I.waitForText('Blob Explorer Locations');
    I.checkA11y('blob-view-locations-a11y-audit.html');
});

Scenario('System Admin User Journey - blob-view-publications-page', ({ I }) => {
    I.amOnPage('/blob-view-publications?locationId=' + LOCATION_ID);
    I.waitForText('Blob Explorer Publications');
    I.checkA11y('blob-view-publications-a11y-audit.html');
});

Scenario('System Admin User Journey - blob-view-publication page', ({ I }) => {
    I.amOnPage('/blob-view-publication?artefactId=' + artefactId);
    I.waitForText('Blob Explorer - JSON file');
    I.checkA11y('blob-view-publication-a11y-audit.html');
});

Scenario('System Admin User Journey - resubmit-confirmation-page', ({ I }) => {
    I.amOnPage('/blob-view-subscription-resubmit-confirmation?artefactId=' + artefactId);
    I.waitForText('Confirm subscription re-submission');
    I.checkA11y('resubmit-confirmation-a11y-audit.html');
});

Scenario('System Admin User Journey - blob-view-subscription-resubmit-confirmed-page', ({ I }) => {
    I.amOnPage('/blob-view-subscription-resubmit-confirmed');
    I.waitForText('Subscription re-submitted');
    I.checkA11y('blob-view-subscription-resubmit-confirmed-a11y-audit.html');
});

//Bulk Create Media Accounts

Scenario('System Admin User Journey - bulk-create-media-accounts-page', ({ I }) => {
    I.amOnPage('/bulk-create-media-accounts');
    I.waitForText('Bulk create media accounts');
    I.checkA11y('bulk-create-media-accounts-a11y-audit.html');
});

Scenario('System Admin User Journey - bulk-create-media-accounts-error-page', ({ I }) => {
    I.amOnPage('/bulk-create-media-accounts');
    I.waitForText('Bulk create media accounts');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.checkA11y('bulk-create-media-accounts-error-a11y-audit.html');
});

Scenario('System Admin User Journey - bulk-create-media-accounts-confirmation-page', ({ I }) => {
    I.amOnPage('/bulk-create-media-accounts');
    I.waitForText('Bulk create media accounts');
    I.attachFile('#bulk-account-upload', BULK_CREATE_USER_FILE_PATH);
    I.click('Continue');
    I.waitForText('Create media accounts confirmation');
    I.checkA11y('bulk-create-media-accounts-confirmation-a11y-audit.html');
});

Scenario('System Admin User Journey - bulk-create-media-accounts-success-page', ({ I }) => {
    I.amOnPage('/bulk-create-media-accounts-confirmed');
    I.waitForText('Media accounts created');
    I.checkA11y('bulk-create-media-accounts-success-a11y-audit.html');
});

//Audit Log Viewer

Scenario('System Admin User Journey - audit-log-viewer-page', ({ I }) => {
    I.amOnPage('/audit-log-viewer');
    I.waitForText('View audit log');
    I.checkA11y('audit-log-viewer-a11y-audit.html');
});

Scenario('System Admin User Journey - audit-log-details', ({ I }) => {
    I.amOnPage('/audit-log-viewer');
    I.waitForText('View audit log');
    I.click('#view-details-link-1');
    I.waitForText('View audit log for ');
    I.checkA11y('audit-log-details-a11y-audit.html');
});

//Manage Location Metadata

Scenario('System Admin User Journey - location-metadata-search-page', ({ I }) => {
    I.amOnPage('/location-metadata-search');
    I.waitForText('Find the location metadata to manage');
    I.checkA11y('location-metadata-search-a11y-audit.html');
});

Scenario('System Admin User Journey - location-metadata-search-error-page', ({ I }) => {
    I.amOnPage('/location-metadata-search');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.checkA11y('location-metadata-search-error-a11y-audit.html');
});

Scenario('System Admin User Journey - location-metadata-search-results-page', ({ I }) => {
    I.amOnPage('/location-metadata-manage?locationId=' + LOCATION_ID);
    I.waitForText('Manage location metadata for ' + LOCATION_NAME);
    I.checkA11y('location-metadata-search-results-a11y-audit.html');
});

Scenario('System Admin User Journey - location-metadata-created-page', ({ I }) => {
    I.amOnPage('/location-metadata-create-confirmed');
    I.waitForText('Location metadata created');
    I.checkA11y('location-metadata-created-a11y-audit.html');
});

Scenario('System Admin User Journey - location-metadata-deleted-page', ({ I }) => {
    I.amOnPage('/location-metadata-delete-confirmed');
    I.waitForText('Location metadata deleted');
    I.checkA11y('location-metadata-deleted-a11y-audit.html');
});

Scenario('System Admin User Journey - location-metadata-update-confirmed-page', ({ I }) => {
    I.amOnPage('/location-metadata-update-confirmed');
    I.waitForText('Location metadata updated');
    I.checkA11y('location-metadata-update-confirmed-a11y-audit.html');
});

AfterSuite(async () => {
    await deleteThirdPartyUserAccount(thirdPartyUserId);
    await clearTestData();
});
