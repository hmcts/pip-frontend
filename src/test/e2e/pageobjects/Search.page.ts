import {HearingListPage} from './HearingList.page';
import { CommonPage } from './Common.page';
import {AlphabeticalSearchPage} from './AlphabeticalSearch.page';

const helpers = require('../Helpers/Selectors');

export class SearchPage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.SearchTitle).catch(() => {
      console.log(`${helpers.SearchTitle} not found`);
    });

    return $(helpers.SearchTitle).getText();
  }

  async enterText(text: string): Promise<void> {
    $(helpers.SearchInput).catch(() => {
      console.log(`${helpers.SearchInput} not found`);
    });

    const searchInput = await $(helpers.SearchInput);
    await searchInput.addValue(text);
    await browser.keys('Escape');
  }

  async clickContinue(): Promise<HearingListPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    const button = await $(helpers.ContinueButton);
    button.click();
    return new HearingListPage();
  }

  async clickAToZCourtsLink(): Promise<AlphabeticalSearchPage> {
    $(helpers.SearchAToZLink).catch(() => {
      console.log(`${helpers.SearchAToZLink} not found`);
    });

    const button = await $(helpers.SearchAToZLink);
    button.click();
    return new AlphabeticalSearchPage();
  }

}
