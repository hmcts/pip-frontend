import { CommonPage } from "./Common.page";

const helpers = require("../Helpers/Selectors");

export class SubscriptionConfirmedPage extends CommonPage {
  async getPanelTitle(): Promise<string> {
    $(helpers.PanelTitle).catch(() => {
      console.log(`${helpers.PanelTitle} not found`);
    });

    return $(helpers.PanelTitle).getText();
  }

  async getPanelBody(): Promise<string> {
    $(helpers.PanelBody).catch(() => {
      console.log(`${helpers.PanelBody} not found`);
    });

    return $(helpers.PanelBody).getText();
  }
}
