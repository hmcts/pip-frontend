import { CommonPage } from './Common.page';
import { SearchPage } from './Search.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionManagementPage extends CommonPage {
    async clickFindCourtNavLink(): Promise<SearchPage> {
        await $(helpers.SignedInBannerFindCourt).catch(() => {
            console.log(`${helpers.SignedInBannerFindCourt} not found`);
        });

        await $(helpers.SignedInBannerFindCourt).click();
        return new SearchPage();
    }
}
