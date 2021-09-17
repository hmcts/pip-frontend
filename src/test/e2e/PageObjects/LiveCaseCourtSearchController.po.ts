// TODO: needs refactoring when PUB-695 gets merged in
import { Page } from 'puppeteer';

const helpers = require('../Helpers/Selectors');

let page: Page;

export class LiveCaseCourtSearchControllerPo {
  constructor(_page: Page) {
    page = _page;
  }

  async getPageTitle(): Promise<string> {
    await page.waitForSelector(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return await page.$eval(helpers.CommonPageTitle, (e: Element) => e.textContent);
  }

  async selectLetter(letter): Promise<LiveCaseCourtSearchControllerPo> {
    await page.waitForSelector(helpers.KeySelector(letter)).catch(() => {
      console.log(`${helpers.KeySelector(letter)} not found`);
    });

    await page.click(helpers.KeySelector(letter));
    return new LiveCaseCourtSearchControllerPo(page);
  }

  async checkIfLetterIsVisible(letter): Promise<boolean> {
    const element = await page.$(helpers.RowSelector(letter));

    return await element.isIntersectingViewport();
  }

  async selectBackToTop(): Promise<LiveCaseCourtSearchControllerPo> {
    await page.waitForSelector(helpers.BackToTopButton).catch(() => {
      console.log(`${helpers.BackToTopButton} not found`);
    });

    await page.click(helpers.BackToTopButton);
    return new LiveCaseCourtSearchControllerPo(page);
  }
}

