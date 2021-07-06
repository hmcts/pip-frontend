import { Page } from 'puppeteer';

const helpers = require('../Helpers/Selectors');

let page: Page;

export class SearchOptionPo {
  constructor(_page: Page) {
    page = _page;
  }

  async getPageTitle() {
    await page.waitForSelector(helpers.SearchOptionsTitle).catch(() => {
      console.log(`${helpers.SearchOptionsTitle} not found`);
    });

    return await page.$eval(helpers.SearchOptionsTitle, (e: Element) => e.textContent);
    // return page;
  }
}