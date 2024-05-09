import {createThirdPartyUserAccount} from '../../shared/testingSupportApi';
import {randomData} from '../../shared/random-data';
import {config as testConfig} from "../../../config";

Feature('System admin manage Third-Party Users');

Scenario('I as a system admin should be able to manage Third-Party Users', async ({I}) => {
    const testProvenanceUserId = testConfig.TEST_SUITE_PREFIX + randomData.getRandomString();
    const userId = await createThirdPartyUserAccount(testProvenanceUserId);

    I.loginAsSystemAdmin();
    I.waitForText('View and edit third-party users and subscriptions');
    I.click('#card-manage-third-party-users');
    I.waitForText('Manage third party users');
    I.see('Name');
    I.see('Role');
    I.see('Created Date');
    I.see(testProvenanceUserId);
    I.see('GENERAL_THIRD_PARTY');
    I.click(locate('//tr').withText(testProvenanceUserId).find('a').withText('View'));
    I.waitForText('Manage User');
    I.see(testProvenanceUserId);
    I.see('GENERAL_THIRD_PARTY');
    I.see('N/A - No subscriptions');
    I.click('#approve');
    I.waitForText('Manage Third Party Subscriptions');
    I.see('Please select a Channel');
    I.see('Please select list types');
    I.click('Save Subscriptions');
    I.waitForText('Third Party Subscriptions Updated');
    I.see('Third party subscriptions for the user have been successfully updated');
    I.deleteThirdPartyUserAccount(userId);
});
