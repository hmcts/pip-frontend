import { CommonPage } from "./Common.page";

const helpers = require("../Helpers/Selectors");

export class CreateAdminAccountSummaryPage extends CommonPage {
  async clickConfirm(): Promise<CreateAdminAccountSummaryPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    await $(helpers.ContinueButton).click();

    return new CreateAdminAccountSummaryPage();
  }

  async getPanelTitle(): Promise<string> {
    $(helpers.PanelTitle).catch(() => {
      console.log(`${helpers.PanelTitle} not found`);
    });

    return $(helpers.PanelTitle).getText();
  }
}
