import { LiveCaseStatusPage } from '../pageobjects/LiveCaseStatus.page';

const helpers = require('../Helpers/Selectors');

export class LiveCaseCourtSearchControllerPage {
  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
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

