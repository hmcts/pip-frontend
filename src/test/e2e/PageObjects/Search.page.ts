import { CommonPage } from './Common.page';
import { AlphabeticalSearchPage } from './AlphabeticalSearch.page';
import { SummaryOfPublicationsPage } from './SummaryOfPublications.page';

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

  async clickContinue(): Promise<SummaryOfPublicationsPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new SummaryOfPublicationsPage();
  }

  async clickAToZCourtsLink(): Promise<AlphabeticalSearchPage> {
    $(helpers.SearchAToZLink).catch(() => {
      console.log(`${helpers.SearchAToZLink} not found`);
    });

    await $(helpers.SearchAToZLink).click();
    return new AlphabeticalSearchPage();
  }

  async clickNavSJP(): Promise<SummaryOfPublicationsPage> {
    $(helpers.BannerSJP).catch(() => {
      console.log(`${helpers.BannerSJP} not found`);
    });

    await $(helpers.BannerSJP).click();
    return new SummaryOfPublicationsPage();
  }
}
