import { CommonPage } from './Common.page';
import { SummaryOfPublicationsPage } from './SummaryOfPublications.page';
import { ViewOptionPage } from './ViewOption.page';

const helpers = require('../Helpers/Selectors');

export class AlphabeticalSearchPage extends CommonPage {
    async clickApplyFiltersButton(): Promise<AlphabeticalSearchPage> {
        await $(helpers.ApplyFiltersButton).catch(() => {
            console.log(`${helpers.ApplyFiltersButton} not found`);
        });

        await $(helpers.ApplyFiltersButton).click();
        return new AlphabeticalSearchPage();
    }

    async checkIfSelected(filter: string): Promise<boolean> {
        $(helpers[filter]).catch(() => {
            console.log(`${helpers[filter]} not found`);
        });

        return await $(helpers[filter]).isSelected();
    }

    async selectFirstListResult(): Promise<SummaryOfPublicationsPage> {
        await $(helpers.FirstItemResult).catch(() => {
            console.log(`${helpers.FirstItemResult} not found`);
        });

        await $(helpers.FirstItemResult).click();
        return new SummaryOfPublicationsPage();
    }

    async selectLastListResult(): Promise<SummaryOfPublicationsPage> {
        await $(helpers.LastItemResult).catch(() => {
            console.log(`${helpers.LastItemResult} not found`);
        });

        await $(helpers.LastItemResult).click();
        return new SummaryOfPublicationsPage();
    }

    async selectSJPLink(): Promise<SummaryOfPublicationsPage> {
        await $(helpers.SJPLink).catch(() => {
            console.log(`${helpers.SJPLink} not found`);
        });
        await $(helpers.SJPLink).click();
        return new SummaryOfPublicationsPage();
    }

    async clickNavHome(): Promise<ViewOptionPage> {
        $(helpers.BannerHome).catch(() => {
            console.log(`${helpers.BannerHome} not found`);
        });

        await $(helpers.BannerHome).click();
        return new ViewOptionPage();
    }
}
