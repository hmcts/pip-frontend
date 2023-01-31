import { LiveCaseCourtSearchControllerPage } from './LiveCaseCourtSearchController.page';
import { SearchPage } from './Search.page';
import { SingleJusticeProcedurePage } from './SingleJusticeProcedure.page';
import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class ViewOptionPage extends CommonPage {
    async getPageTitle(): Promise<string> {
        $(helpers.ViewOptionsTitle).catch(() => {
            console.log(`${helpers.ViewOptionsTitle} not found`);
        });

        return $(helpers.ViewOptionsTitle).getText();
    }

    async clickContinueForSearch(): Promise<SearchPage> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });
        const continueButton = await $(helpers.ContinueButton);
        continueButton.click();

        return new SearchPage();
    }

    async clickContinueForLiveHearings(): Promise<LiveCaseCourtSearchControllerPage> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });
        const continueButton = await $(helpers.ContinueButton);
        continueButton.click();

        return new LiveCaseCourtSearchControllerPage();
    }

    async clickContinueSingleJusticeProcedure(): Promise<SingleJusticeProcedurePage> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });
        const continueButton = await $(helpers.ContinueButton);
        continueButton.click();

        return new SingleJusticeProcedurePage();
    }

    async clickFindACourtBannerLink(): Promise<SearchPage> {
        $(helpers.BannerFindCourt).catch(() => {
            console.log(`${helpers.BannerFindCourt} not found`);
        });

        await $(helpers.BannerFindCourt).click();
        return new SearchPage();
    }
}
