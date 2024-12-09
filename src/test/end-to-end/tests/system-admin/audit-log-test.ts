import { getCurrentDateWthFormat, getDateNowAndFuture, padFormatted } from '../../shared/shared-functions';
import { config, config as testConfig } from '../../../config';
import { createLocation } from '../../shared/testingSupportApi';
import { randomData } from '../../shared/random-data';

Feature('System admin audit log');

Scenario.skip(
    'I as a system admin should be able to view audit log for system admin view third-party users action and Filter the results',
    async ({ I }) => {
        I.loginAsSsoSystemAdmin();
        I.click('#card-manage-third-party-users');
        I.click('Back');
        I.waitForText('System Admin Dashboard');

        I.click('#card-user-management');
        I.waitForText('User Management');
        I.click('Back');
        I.waitForText('System Admin Dashboard');

        I.click('#card-audit-log-viewer');
        I.waitForText('System admin audit log');
        I.see('Timestamp');
        I.see('Email');
        I.see('Action');

        I.click(locate('//tr').withText('View Third Party Users').find('a').withText('View'));
        I.waitForText('View audit log for ' + getCurrentDateWthFormat('dd/MM/yyyy'));
        I.see(testConfig.SSO_TEST_SYSTEM_ADMIN_USER as string);
        I.see('System Admin');
        I.see('SSO');
        I.see('View Third Party Users');
        I.see('User requested to view all third party users');

        I.click('Home');
        I.waitForText('System Admin Dashboard');
        I.click('#card-audit-log-viewer');
        I.waitForText('System admin audit log');

        I.click(locate('//tr').withText('View User Management').find('a').withText('View'));
        I.waitForText('View audit log for ' + getCurrentDateWthFormat('dd/MM/yyyy'));
        I.see(testConfig.SSO_TEST_SYSTEM_ADMIN_USER as string);
        I.see('System Admin');
        I.see('SSO');
        I.see('View User Management');
        I.see('All user data requested by this admin');

        I.logoutSsoSystemAdmin();
    }
);

Scenario('I as a system admin should be able to view audit log for admin delete publication action', async ({ I }) => {
    const listType = 'Civil And Family Daily Cause List';
    const fileName = 'civilAndFamilyDailyCauseList.json';
    const [date, dayAfter] = getDateNowAndFuture();
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();

    await createLocation(locationId, locationName);

    I.loginAsSsoSystemAdmin();
    I.click('Admin Dashboard');
    I.click('#card-manual-upload');
    I.waitForText('Manual upload');
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
    I.click('Confirm');
    I.waitForText('Success');

    I.click('Home');
    I.click('#card-audit-log-viewer');
    I.waitForText('System admin audit log');
    I.see('Timestamp');
    I.see('Email');
    I.see('Action');
    I.see('Filter');
    I.fillField('#email', testConfig.SSO_TEST_SYSTEM_ADMIN_USER as string);
    I.fillField('#userId', testConfig.SSO_TEST_SYSTEM_ADMIN_USER_ID as string);
    I.fillField('#filterDate-day', padFormatted(date.getDate()) as string);
    I.fillField('#filterDate-month', padFormatted(date.getMonth() + 1));
    I.fillField('#filterDate-year', date.getFullYear());
    I.checkOption('#actions-20');
    I.click('Apply filters');

    const publicationLocator = locate('//tr').withText('Upload Publication').find('a').withText('View');
    I.click(publicationLocator);
    I.waitForText('View audit log for ');
    I.see(testConfig.SSO_TEST_SYSTEM_ADMIN_USER as string);
    I.see(testConfig.SSO_TEST_SYSTEM_ADMIN_USER_ID as string);

    I.click('Admin Dashboard');
    I.click('#card-remove-list-search');
    I.waitForText('Find content to remove');
    I.see('Search by court or tribunal name');
    I.fillField('#search-input', locationName);
    I.click('Continue');
    I.waitForText('Select content to remove');
    I.click(locate('//tr').withText(listType).find('.govuk-checkboxes__input'));
    I.click('Continue');
    I.waitForText('Are you sure you want to remove this content?');
    I.click('#remove-choice');
    I.click('Continue');
    I.waitForText('Success');

    I.click('Home');
    I.see('System Admin Dashboard');
    I.click('#card-audit-log-viewer');
    I.waitForText('System admin audit log');
    I.see('Filter');
    I.fillField('#filterDate-day', padFormatted(date.getDate()) as string);
    I.click('Apply filters');
    I.waitForText('There is a problem');
    I.see('Please enter valid filter date');
    I.fillField('#filterDate-day', date.getFullYear());
    I.fillField('#filterDate-month', padFormatted(date.getMonth() + 1));
    I.fillField('#filterDate-year', date.getFullYear());
    I.click('Apply filters');
    I.waitForText('There is a problem');
    I.see('Please enter valid filter date');
    I.fillField('#email', testConfig.SSO_TEST_SYSTEM_ADMIN_USER as string);
    I.fillField('#userId', testConfig.SSO_TEST_SYSTEM_ADMIN_USER_ID as string);
    I.fillField('#filterDate-day', padFormatted(date.getDate()) as string);
    I.fillField('#filterDate-month', padFormatted(date.getMonth() + 1));
    I.fillField('#filterDate-year', date.getFullYear());
    I.checkOption('#actions-10');
    I.click('Apply filters');

    const deleteLocator = locate('//tr').withText('Delete Publication').find('a').withText('View');
    I.click(deleteLocator);
    I.waitForText('View audit log for ');
    I.logoutSsoSystemAdmin();
});
