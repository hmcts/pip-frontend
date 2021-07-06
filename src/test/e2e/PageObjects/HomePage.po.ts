import { SearchOptionPo } from './SearchOption.po';
import {Page} from 'puppeteer';

const helpers = require('../Helpers/Selectors');
const config = require('../../../../jest.config.e2e');

let page: Page;

export class HomePagePo {
  async OpenHomePage(_page: Page): Promise<any> {
    page = _page;
    await page.goto(config.globals.URL, {waitUntil: 'domcontentloaded'});
    return page;
  }

  async getPageTitle() {
    return await page.$eval(helpers.MainHeader, (e: Element) => e.textContent);
  }

  async ClickStartNowButton() {
    await page.waitForSelector(helpers.StartNowButton).catch(() => {
      console.log(`${helpers.StartNowButton} not found`);
    });

    await page.click(helpers.StartNowButton);

    return new SearchOptionPo(page);
  }
}
