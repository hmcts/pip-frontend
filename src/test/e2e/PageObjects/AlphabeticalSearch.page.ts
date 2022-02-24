import { HearingListPage } from './HearingList.page';
import { CommonPage } from './Common.page';
import { SummaryOfPublicationsPage } from './SummaryOfPublications.page';

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

  async selectSecondListResult(): Promise<HearingListPage> {
    await $(helpers.SecondItemResult).catch(() => {
      console.log(`${helpers.SecondItemResult} not found`);
    });

    const secondItem = await $(helpers.SecondItemResult);
    secondItem.click();
    return new HearingListPage();
  }

  async selectSJPLink(): Promise<SummaryOfPublicationsPage> {
    await $(helpers.SJPLink).catch(() => {
      console.log(`${helpers.SJPLink} not found`);
    });
    const sjpLink = await $(helpers.SJPLink);
    sjpLink.click();
    return new SummaryOfPublicationsPage();
  }

}
