import { SubscriptionManagementPo } from './SubscriptionManagement.po';
import {Page} from 'puppeteer';

const helpers = require('../Helpers/Selectors');
const config = require('../../../../jest.config.e2e');

let page: Page;

export class OtpLoginPagePo {
  async OpenOtpLoginPage(_page: Page): Promise<any> {
    page = _page;
    await page.goto(config.globals.URL + '/otp-login', {waitUntil: 'domcontentloaded'});
    return page;
  }

  async getPageTitle(): Promise<string> {
    await page.waitForSelector(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return await page.$eval(helpers.CommonPageTitle, (e: Element) => e.textContent);
  }

  async enterText(text: string): Promise<void> {
    await page.waitForSelector(helpers.OtpInput).catch(() => {
      console.log(`${helpers.OtpInput} not found`);
    });

    await page.type(helpers.OtpInput, text);
    await page.keyboard.press('Escape');
  }

  async clickContinue(): Promise<SubscriptionManagementPo> {
    await page.waitForSelector(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await page.click(helpers.ContinueButton);

    return new SubscriptionManagementPo(page);
  }
}
