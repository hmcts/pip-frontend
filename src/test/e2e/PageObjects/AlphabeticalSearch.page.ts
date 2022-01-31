import { HearingListPage } from './HearingList.page';
import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class AlphabeticalSearchPage extends CommonPage {
  async clickApplyFiltersButton(): Promise<void> {
    await $(helpers.ApplyFiltersButton).catch(() => {
      console.log(`${helpers.ApplyFiltersButton} not found`);
    });

    await $(helpers.ApplyFiltersButton).click();
  }

  async checkIfSelected(filter: string): Promise<boolean> {
    $(helpers[filter]).catch(() => {
      console.log(`${helpers[filter]} not found`);
    });

    return await $(helpers[filter]).isSelected();
  }

  async selectFirstListResult(): Promise<HearingListPage> {
    await $(helpers.FirstItemResult).catch(() => {
      console.log(`${helpers.FirstItemResult} not found`);
    });

    const firstItem = await $(helpers.FirstItemResult);
    firstItem.click();
    return new HearingListPage();
  }
}
