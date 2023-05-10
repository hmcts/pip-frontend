import { generateTestLocation, getCurrentDate, removeTestLocationFile } from '../../shared/shared-functions';
import { config as testConfig } from '../../../config';
import { createLocation, uploadPublication } from '../../shared/testingSupportApi';
import { DateTime } from 'luxon';

Feature('System admin audit log');

Scenario(
    'I as a system admin should be able to view audit log for system admin view third-party users action',
    async ({ I }) => {
        I.loginAsSystemAdmin();
        I.see('System Admin Dashboard');
        I.click('#card-manage-third-party-users');
        I.click('Back');

        I.click('#card-audit-log-viewer');
        I.waitForText('System admin audit log');
        I.see('Timestamp');
        I.see('Email');
        I.see('Action');

        I.click(locate('//tr').withText('VIEW_THIRD_PARTY_USERS').find('a').withText('View'));
        I.waitForText('View audit log for ' + getCurrentDate('dd/MM/yyyy'));
        I.see(testConfig.SYSTEM_ADMIN_USERNAME as string);
        I.see('System Admin');
        I.see('B2C');
        I.see('VIEW_THIRD_PARTY_USERS');
        I.see('User requested to view all third party users');
        I.logout();
    }
);

Scenario('I as a system admin should be able to view audit log for admin delete publication action', async ({ I }) => {
    const listType = 'Civil And Family Daily Cause List';
    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });

    const [locationId, locationName, locationFileName] = generateTestLocation();
    await createLocation(locationFileName);
    const artefactId = await uploadPublication('PUBLIC', locationId, displayFrom, displayTo, 'ENGLISH');

    I.loginAsAdmin();
    I.see('Your Dashboard');
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
    I.logout();

    I.loginAsSystemAdmin();
    I.see('System Admin Dashboard');
    I.click('#card-audit-log-viewer');
    I.waitForText('System admin audit log');
    I.see('Timestamp');
    I.see('Email');
    I.see('Action');

    I.click(locate('//tr').withText('DELETE_PUBLICATION').find('a').withText('View'));
    I.waitForText('View audit log for ' + getCurrentDate('dd/MM/yyyy'));
    I.see(testConfig.ADMIN_USERNAME as string);
    I.see('CTSC Super Admin');
    I.see('B2C');
    I.see('DELETE_PUBLICATION');
    I.see('Publication with artefact id ' + artefactId + ' successfully deleted');
    I.logout();

    I.deleteLocation(locationId);
    removeTestLocationFile(locationFileName);
});
