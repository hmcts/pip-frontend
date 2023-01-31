import { CommonPage } from './Common.page';
import { SubscriptionManagementPage } from './SubscriptionManagement.page';
import { SearchPage } from './Search.page';
import { SummaryOfPublicationsPage } from './SummaryOfPublications.page';
import { SessionLoggedOutPage } from './SessionLoggedOut.page';

const helpers = require('../Helpers/Selectors');

export class AccountHomePage extends CommonPage {
    async clickSubscriptionsCard(): Promise<SubscriptionManagementPage> {
        await $(helpers.EmailSubscriptionLink).catch(() => {
            console.log(`${helpers.EmailSubscriptionLink} not found`);
        });

        await $(helpers.EmailSubscriptionLink).click();
        return new SubscriptionManagementPage();
    }

    async clickEmailSubscriptionsNavLink(): Promise<SubscriptionManagementPage> {
        await $(helpers.SignedInBannerEmailSubs).catch(() => {
            console.log(`${helpers.SignedInBannerEmailSubs} not found`);
        });

        await $(helpers.SignedInBannerEmailSubs).click();
        return new SubscriptionManagementPage();
    }

    async clickCourtCard(): Promise<SearchPage> {
        await $(helpers.CourtSearchLink).catch(() => {
            console.log(`${helpers.CourtSearchLink} not found`);
        });

        await $(helpers.CourtSearchLink).click();
        return new SearchPage();
    }

    async clickSJPCard(): Promise<SummaryOfPublicationsPage> {
        await $(helpers.SJPCardLink).catch(() => {
            console.log(`${helpers.SJPCardLink} not found`);
        });

        await $(helpers.SJPCardLink).click();
        return new SummaryOfPublicationsPage();
    }

    async clickSignOut(): Promise<SessionLoggedOutPage> {
        await $(helpers.SignedInBannerSignOut).catch(() => {
            console.log(`${helpers.SignedInBannerSignOut} not found`);
        });

        await $(helpers.SignedInBannerSignOut).click();
        return new SessionLoggedOutPage();
    }

    async clickSignOutForCftAccount(): Promise<SessionLoggedOutPage> {
        await $(helpers.SignedInBannerSignOut).catch(() => {
            console.log(`${helpers.SignedInBannerSignOut} not found`);
        });

        await $(helpers.SignedInBannerSignOut).click();
        return new SessionLoggedOutPage();
    }
}
