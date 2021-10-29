import { LiveCaseStatusPage } from './LiveCaseStatus.page';

const helpers = require('../Helpers/Selectors');

export class LiveCaseCourtSearchControllerPage {
  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }

  async selectLetter(letter): Promise<void> {
    await $(helpers.KeySelector(letter)).catch(() => {
      console.log(`${helpers.KeySelector(letter)} not found`);
    });

    const letterLink = await $(helpers.KeySelector(letter));
    letterLink.click();
  }

  async checkIfLetterIsVisible(letter): Promise<boolean> {
    const element = await $(helpers.RowSelector(letter));
    return await element.isDisplayedInViewport();
  }

  async selectBackToTop(): Promise<void> {
    await $(helpers.BackToTopButton).catch(() => {
      console.log(`${helpers.BackToTopButton} not found`);
    });

    const backToTop = await $(helpers.BackToTopButton);
    backToTop.click();
  }

  async selectFirstValidListResult(): Promise<LiveCaseStatusPage> {
    await $(helpers.LiveHearingsTableFirstValidResult).catch(() => {
      console.log(`${helpers.LiveHearingsTableFirstValidResult} not found`);
    });

    const firstValidItem = await $(helpers.LiveHearingsTableFirstValidResult);
    firstValidItem.click();
    return new LiveCaseStatusPage();
  }
}

