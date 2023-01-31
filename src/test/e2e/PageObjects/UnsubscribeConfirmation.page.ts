const helpers = require("../Helpers/Selectors");

export class UnsubscribeConfirmationPage {
  async getPanelTitle(): Promise<string> {
    $(helpers.panelTitle).catch(() => {
      console.log(`${helpers.panelTitle} not found`);
    });

    return $(helpers.panelTitle).getText();
  }
}
