import {Page} from 'puppeteer';
import { ViewOptionPo } from './ViewOption.po';

const helpers = require('../Helpers/Selectors');
const config = require('../../../../jest.config.e2e');

let page: Page;

export class HomePagePo {
  async OpenHomePage(_page: Page): Promise<any> {
    page = _page;
    await page.goto(config.globals.URL, {waitUntil: 'domcontentloaded'});
    return page;
  }

  async getPageTitle(): Promise<string> {
    return await page.$eval(helpers.MainHeader, (e: Element) => e.textContent);
  }

  async ClickStartNowButton(): Promise<ViewOptionPo> {
    await page.waitForSelector(helpers.StartNowButton).catch(() => {
      console.log(`${helpers.StartNowButton} not found`);
    });

    await page.click(helpers.StartNowButton);

    return new ViewOptionPo(page);
  }
}
