import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class SjpPressListPage extends CommonPage {
    async clickShowFiltersButton(): Promise<SjpPressListPage> {
        $(helpers.ShowFiltersButton).catch(() => {
            console.log(`${helpers.ShowFiltersButton} not found`);
        });
        await $(helpers.ShowFiltersButton).scrollIntoView();
        await $(helpers.ShowFiltersButton).click();
        return new SjpPressListPage();
    }

    async clickApplyFiltersButton(): Promise<SjpPressListPage> {
        await $(helpers.ApplyFiltersButton).catch(() => {
            console.log(`${helpers.ApplyFiltersButton} not found`);
        });

        await $(helpers.ApplyFiltersButton).click();
        return new SjpPressListPage();
    }

    async clickClearFiltersLink(): Promise<SjpPressListPage> {
        await $(helpers.ClearFiltersLink).catch(() => {
            console.log(`${helpers.ClearFiltersLink} not found`);
        });

        await $(helpers.ClearFiltersLink).click();
        return new SjpPressListPage();
    }

    async clickRemoveFirstFilterLink(): Promise<SjpPressListPage> {
        await $(helpers.RemoveFirstFilterLink).catch(() => {
            console.log(`${helpers.RemoveFirstFilterLink} not found`);
        });

        await $(helpers.RemoveFirstFilterLink).click();
        return new SjpPressListPage();
    }

    async checkIfSelected(filter: string): Promise<boolean> {
        $(helpers[filter]).catch(() => {
            console.log(`${helpers[filter]} not found`);
        });

        return await $(helpers[filter]).isSelected();
    }

    async enterTextToSearchFilters(text: string): Promise<void> {
        $(helpers.SearchFilters).catch(() => {
            console.log(`${helpers.SearchFilters} not found`);
        });

        const searchFilters = await $(helpers.SearchFilters);
        await searchFilters.setValue(text);
    }

    get summaryListItems(): Promise<number> {
        const items = $$(helpers.SjpPressSummaryList);
        return items.length;
    }

    get filteredTags(): Promise<number> {
        const items = $$(helpers.FilterTags);
        return items.length;
    }

    async displayedFilters(): Promise<number> {
        let displayedFilterCount = 0;
        const items = await $$(helpers.Filters);

        for (let i = 0; i < items.length; i++) {
            const style = await items[i].getAttribute('style');
            if (!style || !style.includes('display: none')) {
                displayedFilterCount++;
            }
        }
        return displayedFilterCount;
    }
}
