import {SearchResultsPo} from './SearchResults.po';
import {Page} from 'puppeteer';

const helpers = require('../Helpers/Selectors');

let page: Page;

export class SearchPo {
  constructor(_page: Page) {
    page = _page;
  }

  async getPageTitle(): Promise<string> {
    await page.waitForSelector(helpers.SearchTitle).catch(() => {
      console.log(`${helpers.SearchTitle} not found`);
    });

    return await page.$eval(helpers.SearchTitle, (e: Element) => e.textContent);
  }

  async enterText(text: string): Promise<void> {
    await page.waitForSelector(helpers.SearchInput).catch(() => {
      console.log(`${helpers.SearchInput} not found`);
    });

    await page.type(helpers.SearchInput, text);
    await page.keyboard.press('Escape');
  }

  async clickContinue(): Promise<SearchResultsPo> {
    await page.waitForSelector(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await page.click(helpers.ContinueButton);
    return new SearchResultsPo(page);
  }
}
