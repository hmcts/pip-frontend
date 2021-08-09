import { SearchPo } from './Search.po';
import {Page} from 'puppeteer';

const helpers = require('../Helpers/Selectors');

let page: Page;

export class SearchOptionPo {
  constructor(_page: Page) {
    page = _page;
  }

  async getPageTitle(): Promise<string> {
    await page.waitForSelector(helpers.SearchOptionsTitle).catch(() => {
      console.log(`${helpers.SearchOptionsTitle} not found`);
    });

    return await page.$eval(helpers.SearchOptionsTitle, (e: Element) => e.textContent);
  }

  async getRadioButtons(): Promise<number> {
    await page.waitForSelector(helpers.RadioButton).catch(() => {
      console.log(`${helpers.RadioButton} not found`);
    });

    const radios = await page.$$(helpers.RadioButton);

    return radios.length;
  }

  async selectSearchRadio(): Promise<void> {
    await page.waitForSelector(helpers.SearchRadioButton).catch(() => {
      console.log(`${helpers.SearchRadioButton} not found`);
    });
    await page.click(helpers.SearchRadioButton);
  }

  async clickContinue(): Promise<SearchPo> {
    await page.waitForSelector(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await page.click(helpers.ContinueButton);
    return new SearchPo(page);
  }
}
