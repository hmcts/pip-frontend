import { getCurrentDateWthFormat, getDateNowAndFuture, padFormatted } from '../../shared/shared-functions';
import { config, config as testConfig } from '../../../config';
import { createLocation } from '../../shared/testingSupportApi';
import { randomData } from '../../shared/random-data';

Feature('System admin audit log');

Scenario(
    'I as a system admin should be able to view audit log for system admin view third-party users action',
    async ({ I }) => {
        I.loginAsSystemAdmin();
        I.see('System Admin Dashboard');
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

        I.click(locate('//tr').withText('VIEW_THIRD_PARTY_USERS').find('a').withText('View'));
        I.waitForText('View audit log for ' + getCurrentDateWthFormat('dd/MM/yyyy'));
        I.see(testConfig.SYSTEM_ADMIN_USERNAME as string);
        I.see('System Admin');
        I.see('B2C');
        I.see('VIEW_THIRD_PARTY_USERS');
        I.see('User requested to view all third party users');

        I.click('Home');
        I.waitForText('System Admin Dashboard');
        I.click('#card-audit-log-viewer');
        I.waitForText('System admin audit log');

        I.click(locate('//tr').withText('USER_MANAGEMENT_VIEW').find('a').withText('View'));
        I.waitForText('View audit log for ' + getCurrentDateWthFormat('dd/MM/yyyy'));
        I.see(testConfig.SYSTEM_ADMIN_USERNAME as string);
        I.see('System Admin');
        I.see('B2C');
        I.see('USER_MANAGEMENT_VIEW');
        I.see('All user data requested by this admin');

        I.logout();
    }
);

Scenario('I as a system admin should be able to view audit log for admin delete publication action', async ({ I }) => {
    const listType = 'Civil And Family Daily Cause List';
    const fileName = 'civilAndFamilyDailyCauseList.json';
    const [date, dayAfter] = getDateNowAndFuture();
    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();

    await createLocation(locationId, locationName);

    I.loginAsSystemAdmin();
    I.see('System Admin Dashboard');
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

    const publicationLocator = locate('//tr').withText('PUBLICATION_UPLOAD').find('a').withText('View');

    for (let i = 0; i <= 3; i++) {
        const numberOfUploadElements = await I.grabNumberOfVisibleElements(publicationLocator);

        if (numberOfUploadElements >= 1) {
            I.click(publicationLocator);
            break;
        } else {
            I.click('Next');
            I.waitForText('System admin audit log');
        }
    }

    I.click('Admin Dashboard');
    I.click('#card-remove-list-search');
    I.waitForText('Find content to remove');
    I.see('Search by court or tribunal name');
    I.fillField('#search-input', locationName);
    I.click('Continue');
    I.waitForText('Select content to remove');
    I.click(locate('//tr').withText(listType).find('a').withText('Remove'));
    I.waitForText('You are about to remove the following publication:');
    I.click('#remove-choice');
    I.click('Continue');
    I.waitForText('Success');

    I.click('Home');
    I.see('System Admin Dashboard');
    I.click('#card-audit-log-viewer');
    I.waitForText('System admin audit log');

    const deleteLocator = locate('//tr').withText('DELETE_PUBLICATION').find('a').withText('View');

    for (let i = 0; i <= 3; i++) {
        const numberOfDeleteElements = await I.grabNumberOfVisibleElements(deleteLocator);

        if (numberOfDeleteElements >= 1) {
            I.click(deleteLocator);
            break;
        } else {
            I.click('Next');
            I.waitForText('System admin audit log');
        }
    }

    I.waitForText('View audit log for ');
    I.logout();
});
