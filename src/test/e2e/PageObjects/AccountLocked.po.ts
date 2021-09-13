import {Page} from 'puppeteer';

const helpers = require('../Helpers/Selectors');
const config = require('../../../../jest.config.e2e');

let page: Page;

export class AccountLockedPo {

  constructor(_page: Page) {
    page = _page;
  }

  async OpenAccountLockedPage(_page: Page): Promise<any> {
    page = _page;
    await page.goto(config.globals.URL + '/account-locked', {waitUntil: 'domcontentloaded'});
    return page;
  }

  async getPageTitle(): Promise<string> {
    await page.waitForSelector(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });


    return await page.$eval(helpers.CommonPageTitle, (e: Element) => e.textContent);
  }

}
