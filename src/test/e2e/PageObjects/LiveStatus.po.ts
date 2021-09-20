// TODO: this needs refactoring once 695 is merged
import { Page } from 'puppeteer';

const helpers = require('../Helpers/Selectors');

let page: Page;

export class LiveCaseStatusPo {
  constructor(_page: Page) {
    page = _page;
  }

  async getPageTitle(): Promise<string> {
    await page.waitForSelector(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return await page.$eval(helpers.CommonPageTitle, (e: Element) => e.textContent);
  }

  async getResults(): Promise<number> {
    await page.waitForSelector(helpers.Results).catch(() => {
      console.log(`${helpers.Results} not found`);
    });

    const results = await page.$$(helpers.Results);
    return results.length;
  }
}
