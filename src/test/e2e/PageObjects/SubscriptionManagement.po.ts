import {Page} from 'puppeteer';
const helpers = require('../Helpers/Selectors');

let page: Page;

export class SubscriptionManagementPo {

  constructor(_page: Page) {
    page = _page;
  }

  async getPageTitle(): Promise<string> {
    await page.waitForSelector(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return await page.$eval(helpers.CommonPageTitle, (e: Element) => e.textContent);
  }


}
