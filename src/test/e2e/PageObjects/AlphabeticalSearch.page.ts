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

  async selectSecondListResult(): Promise<HearingListPage> {
    await $(helpers.SecondItemResult).catch(() => {
      console.log(`${helpers.SecondItemResult} not found`);
    });

    const secondItem = await $(helpers.SecondItemResult);
    secondItem.click();
    return new HearingListPage();
  }

  async selectSJPLink(): Promise<HearingListPage> {
    await $(helpers.SJPLink).catch(() => {
      console.log(`${helpers.SJPLink} not found`);
    });
    const sjpLink = await $(helpers.SJPLink);
    sjpLink.click();
    return new HearingListPage();
  }

}
