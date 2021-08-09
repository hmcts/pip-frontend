import {Page} from 'puppeteer';

const helpers = require('../Helpers/Selectors');

let page: Page;

export class SearchResultsPo {
  constructor(_page: Page) {
    page = _page;
  }

  async getPageTitle(): Promise<string> {
    await page.waitForSelector(helpers.SearchResultsTitle).catch(() => {
      console.log(`${helpers.SearchResultsTitle} not found`);
    });

    return await page.$eval(helpers.SearchResultsTitle, (e: Element) => e.textContent);
  }

  async getResults(): Promise<number> {
    await page.waitForSelector(helpers.Results).catch(() => {
      console.log(`${helpers.Results} not found`);
    });

    const results = await page.$$(helpers.Results);
    return results.length;
  }
}
