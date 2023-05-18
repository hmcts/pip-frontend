import { CommonPage } from './Common.page';
import { CreateAdminAccountPage } from './CreateAdminAccount.page';
import { MediaAccountRequestsPage } from './MediaAccountRequests.page';
import { SessionLoggedOutPage } from './SessionLoggedOut.page';

const helpers = require('../Helpers/Selectors');

export class AdminDashboardPage extends CommonPage {
    async clickCreateNewAccountCard(): Promise<CreateAdminAccountPage> {
        await $(helpers.CreateAdminAccount).catch(() => {
            console.log(`${helpers.CreateAdminAccount} not found`);
        });

        await $(helpers.CreateAdminAccount).click();
        return new CreateAdminAccountPage();
    }

    async clickManageMedia(): Promise<MediaAccountRequestsPage> {
        await $(helpers.ManageMediaAccounts).catch(() => {
            console.log(`${helpers.ManageMediaAccounts} not found`);
        });

        await $(helpers.ManageMediaAccounts).click();
        return new MediaAccountRequestsPage();
    }

    async clickSignOut(): Promise<SessionLoggedOutPage> {
        await $(helpers.SignedInBannerSignOut).catch(() => {
            console.log(`${helpers.SignedInBannerSignOut} not found`);
        });

        await $(helpers.SignedInBannerSignOut).click();
        return new SessionLoggedOutPage();
    }
}
