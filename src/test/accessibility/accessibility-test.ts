import { DateTime } from 'luxon';
import { randomData } from '../end-to-end/shared/random-data';
import { config } from '../config';
import {clearTestData, createLocation, uploadPublication} from '../end-to-end/shared/testingSupportApi';

Feature('accessibility_tests');

const displayFrom = DateTime.now().toISO({ includeOffset: false });
const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });
const locationId = randomData.getRandomLocationId();
const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
let artefactId;

BeforeSuite(async () => {
    await createLocation(locationId, locationName);
    artefactId = await uploadPublication('PUBLIC', locationId, displayFrom, displayFrom, displayTo, 'ENGLISH');
});

Scenario('Unverified User Journey - home-page', async ({ I }) => {
    I.amOnPage('/');
    I.checkA11y('home-page-a11y-audit.html');
});
Scenario('Unverified User Journey - sign-in-page', async ({ I }) => {
    I.amOnPage('/sign-in');
    I.checkA11y('sign-in-a11y-audit.html');
});

Scenario('Unverified User Journey- search-page', async ({ I }) => {
    I.amOnPage('/search');
    I.checkA11y('search-a11y-audit.html');
});

Scenario('Unverified User Journey - view-option-page', async ({ I }) => {
    I.amOnPage('/view-option');
    I.checkA11y('view-option-a11y-audit.html');
});

Scenario('Unverified User Journey - summary-of-publications-page', async ({ I }) => {
    I.amOnPage('/summary-of-publications?locationId=' + locationId);
    I.checkA11y('summary-of-publications-a11y-audit.html');
});

Scenario('Unverified User Journey - list-display-page', async ({ I }) => {
    I.amOnPage('/civil-and-family-daily-cause-list?artefactId=' + artefactId);
    I.checkA11y('list-display-a11y-audit.html');
});

Scenario('Unverified User Journey- alphabetical-search-page', async ({ I }) => {
    I.amOnPage('/alphabetical-search');
    I.checkA11y('alphabetical-search-a11y-audit.html');
});

Scenario('Unverified User Journey- accessibility-statement-page', async ({ I }) => {
    I.amOnPage('/accessibility-statement');
    I.checkA11y('accessibility-statement-a11y-audit.html');
});

Scenario('Unverified User Journey- cookie-policy-page', async ({ I }) => {
    I.amOnPage('/cookie-policy');
    I.checkA11y('cookie-policy-a11y-audit.html');
});

AfterSuite(async () => {
    await clearTestData();
});
