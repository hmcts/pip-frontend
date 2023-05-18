import { CommonPage } from './Common.page';
import { SessionLoggedOutPage } from './SessionLoggedOut.page';
import { ManageThirdPartyUsersPage } from './ManageThirdPartyUsers.page';
import { BulkCreateMediaAccountsPage } from './BulkCreateMediaAccounts.page';

const helpers = require('../Helpers/Selectors');

export class SystemAdminDashboardPage extends CommonPage {
    async clickManageThirdPartyUsersCard(): Promise<ManageThirdPartyUsersPage> {
        await $(helpers.ManageThirdPartyUsers).catch(() => {
            console.log(`${helpers.ManageThirdPartyUsers} not found`);
        });

        await $(helpers.ManageThirdPartyUsers).click();
        return new ManageThirdPartyUsersPage();
    }

    async clickBulkCreateMediaAccountsCard(): Promise<BulkCreateMediaAccountsPage> {
        await $(helpers.BulkCreateMediaAccounts).catch(() => {
            console.log(`${helpers.BulkCreateMediaAccounts} not found`);
        });

        await $(helpers.BulkCreateMediaAccounts).click();
        return new BulkCreateMediaAccountsPage();
    }

    async clickSignOut(): Promise<SessionLoggedOutPage> {
        await $(helpers.SignedInBannerSignOut).catch(() => {
            console.log(`${helpers.SignedInBannerSignOut} not found`);
        });

        await $(helpers.SignedInBannerSignOut).click();
        return new SessionLoggedOutPage();
    }

    async getPageTitle(): Promise<string> {
        $(helpers.CommonPageTitle).catch(() => {
            console.log(`${helpers.CommonPageTitle} not found`);
        });

        return $(helpers.CommonPageTitle).getText();
    }
}
