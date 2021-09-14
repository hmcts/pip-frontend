// TODO: needs refactoring when PUB-695 gets merged in
import { Page } from 'puppeteer';
import { HearingListPo } from './HearingList.po';

const helpers = require('../Helpers/Selectors');

let page: Page;

export class LiveHearingsPo {
  constructor(_page: Page) {
    page = _page;
  }

  async getPageTitle(): Promise<string> {
    await page.waitForSelector(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });


    return await page.$eval(helpers.CommonPageTitle, (e: Element) => e.textContent);
  }

  async selectLetter(letter): Promise<LiveHearingsPo> {
    await page.waitForSelector(helpers.KeySelector(letter)).catch(() => {
      console.log(`${helpers.KeySelector(letter)} not found`);
    });

    await page.click(helpers.KeySelector(letter));
    return new LiveHearingsPo(page);
  }

  async checkIfLetterIsVisible(letter): Promise<boolean> {
    const element = await page.$(helpers.RowSelector(letter));

    return await element.isIntersectingViewport();
  }

  async selectBackToTop(): Promise<LiveHearingsPo> {
    await page.waitForSelector(helpers.BackToTopButton).catch(() => {
      console.log(`${helpers.BackToTopButton} not found`);
    });

    await page.click(helpers.BackToTopButton);
    return new LiveHearingsPo(page);
  }

  async selectFirstListResult(): Promise<HearingListPo> {
    await page.waitForSelector(helpers.FirstItemResult).catch(() => {
      console.log(`${helpers.FirstItemResult} not found`);
    });

    await page.click(helpers.FirstItemResult);
    return new HearingListPo(page);
  }


}

