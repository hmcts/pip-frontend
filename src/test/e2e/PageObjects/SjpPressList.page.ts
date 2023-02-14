import { CommonPage } from './Common.page';

import helpers from '../Helpers/Selectors';

export class SjpPressListPage extends CommonPage {
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

    get summaryListItems(): Promise<number> {
        const items = $$(helpers.SjpPressSummaryList);
        return items.length;
    }

    get filteredTags(): Promise<number> {
        const items = $$(helpers.FilterTags);
        return items.length;
    }
}
