import { Page } from 'puppeteer';

const helpers = require('../Helpers/Selectors');

class HomePage {
  async OpenHomePage(page: Page): Promise<any> {
    await page.goto(helpers.baseUrl, {waitUntil: 'domcontentloaded'});

    const pageTitle = await page.$eval(helpers.MainHeader, (e: Element) => e.textContent);
    expect(pageTitle).toBe('Find a court or tribunal listing');
  }

  async ClickStartNowButton(page: Page): Promise<any> {
    await page.waitForSelector(helpers.StartNowButton).catch(() => {
      console.log(`${helpers.StartNowButton} not found`);
    });

    await page.click(helpers.StartNowButton);
    await page.waitForSelector(helpers.SearchOptionsTitle).catch(() => {
      console.log(`${helpers.SearchOptionsTitle} not found`);
    });

    const pageTitle = await page.$eval(helpers.SearchOptionsTitle, (e: Element) => e.textContent);
    const radioElements = await page.$$(helpers.RadioButton);

    expect(pageTitle).toContain('Find a court or tribunal list');
    expect(radioElements.length).toBe(2);
  }
}

module.exports = HomePage;