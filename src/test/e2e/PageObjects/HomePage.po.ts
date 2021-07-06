import { Page } from 'puppeteer';
import { SearchOptionPo } from './SearchOption.po';

const helpers = require('../Helpers/Selectors');

let page: Page;

export class HomePagePo {
  async OpenHomePage(): Promise<any> {
    await page.goto(helpers.baseUrl, {waitUntil: 'domcontentloaded'});
    return page;
  }

  async getPageTitle() {
    return  await page.$eval(helpers.MainHeader, (e: Element) => e.textContent);
  }

  async ClickStartNowButton(): Promise<any> {
    await page.waitForSelector(helpers.StartNowButton).catch(() => {
      console.log(`${helpers.StartNowButton} not found`);
    });

    await page.click(helpers.StartNowButton);

    return new SearchOptionPo(page);
  }
}