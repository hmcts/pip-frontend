import { Page } from 'puppeteer';

const helpers = require('../Helpers/Selectors');

class HomePage {
  async OpenHomePage(page: Page): Promise<any> {
    await page.goto(helpers.baseUrl, {waitUntil: 'domcontentloaded'});

    return  await page.$eval(helpers.MainHeader, (e: Element) => e.textContent);
  }

  async ClickStartNowButton(page: Page): Promise<any> {
    await page.waitForSelector(helpers.StartNowButton).catch(() => {
      console.log(`${helpers.StartNowButton} not found`);
    });

    await page.click(helpers.StartNowButton);
    await page.waitForSelector(helpers.SearchOptionsTitle).catch(() => {
      console.log(`${helpers.SearchOptionsTitle} not found`);
    });

    return await page.$eval(helpers.SearchOptionsTitle, (e: Element) => e.textContent);
  }
}

module.exports = HomePage;
