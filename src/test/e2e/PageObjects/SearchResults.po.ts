import {Page} from 'puppeteer';
import {HearingListPo} from './HearingList.po';

const helpers = require('../Helpers/Selectors');

let page: Page;

export class SearchResultsPo {
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

  async selectCourt(): Promise<HearingListPo> {
    await page.waitForSelector(helpers.LinkResult).catch(() => {
      console.log(`${helpers.LinkResult} not found`);
    });

    await page.click(helpers.LinkResult);

    return new HearingListPo(page);
  }
}
