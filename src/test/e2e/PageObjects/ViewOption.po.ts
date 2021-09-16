// TODO: needs refactoring when PUB-695 gets merged in
import { Page } from 'puppeteer';
import { SearchOptionPo } from './SearchOption.po';
import { LiveCasePo } from './LiveCase.po';

const helpers = require('../Helpers/Selectors');

let page: Page;

export class ViewOptionPo {
  constructor(_page: Page) {
    page = _page;
  }

  async getPageTitle(): Promise<string> {
    await page.waitForSelector(helpers.ViewOptionsTitle).catch(() => {
      console.log(`${helpers.ViewOptionsTitle} not found`);
    });

    return await page.$eval(helpers.ViewOptionsTitle, (e: Element) => e.textContent);
  }

  async getRadioButtons(): Promise<number> {
    await page.waitForSelector(helpers.RadioButton).catch(() => {
      console.log(`${helpers.RadioButton} not found`);
    });

    const radios = await page.$$(helpers.RadioButton);

    return radios.length;
  }

  async selectSearchRadio(): Promise<void> {
    await page.waitForSelector(helpers.ViewSearchRadioButton).catch(() => {
      console.log(`${helpers.ViewSearchRadioButton} not found`);
    });
    await page.click(helpers.ViewSearchRadioButton);
  }

  async selectLiveHearingsRadio(): Promise<void> {
    await page.waitForSelector(helpers.LiveHearingsRadioButton).catch(() => {
      console.log(`${helpers.LiveHearingsRadioButton} not found`);
    });
    await page.click(helpers.LiveHearingsRadioButton);
  }

  async clickContinueForSearch(): Promise<SearchOptionPo> {
    await page.waitForSelector(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await page.click(helpers.ContinueButton);
    return new SearchOptionPo(page);
  }

  async clickContinueForLiveHearings(): Promise<LiveCasePo> {
    await page.waitForSelector(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await page.click(helpers.ContinueButton);
    return new LiveCasePo(page);
  }
}
