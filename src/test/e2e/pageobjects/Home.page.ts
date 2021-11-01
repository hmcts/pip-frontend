import { ViewOptionPage } from './ViewOption.page';
import { OtpLoginPage } from './OtpLogin.page';
import { SingleJusticeProcedureSearchPage } from './SingleJusticeProcedureSearch.page';
import { LiveCaseCourtSearchControllerPage } from './LiveCaseCourtSearchController.page';

const helpers = require('../Helpers/Selectors');

export class HomePage {

  open (path): Promise<string> {
    return browser.url(path);
  }

  async getPageTitle(): Promise<string> {
    $(helpers.MainHeader).catch(() => {
      console.log(`${helpers.MainHeader} not found`);
    });

    return $(helpers.MainHeader).getText();
  }

  async clickStartNowButton(): Promise<ViewOptionPage> {
    const button = await $(helpers.StartNowButton);
    button.click();
    return new ViewOptionPage();
  }

  async clickSelectSubscriptions(): Promise<OtpLoginPage> {
    const select = await $(helpers.SubscriptionsSelect);
    select.click();
    return new OtpLoginPage();
  }

  async clickSelectViewPublicSingleJusticeProcedure(): Promise<SingleJusticeProcedureSearchPage> {
    const select = await $(helpers.SingleJusticeProcedureSelect);
    select.click();
    return new SingleJusticeProcedureSearchPage();
  }

  async clickSelectLiveCaseStatusUpdates(): Promise<LiveCaseCourtSearchControllerPage> {
    const select = await $(helpers.LiveCaseSelect);
    select.click();
    return new LiveCaseCourtSearchControllerPage();
  }
}
