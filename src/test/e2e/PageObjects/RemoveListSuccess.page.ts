import { CommonPage } from "./Common.page";
import { AdminDashboardPage } from "./AdminDashboard.page";

const helpers = require("../Helpers/Selectors");

export class RemoveListSuccessPage extends CommonPage {
  async getPanelTitle(): Promise<string> {
    $(helpers.panelTitle).catch(() => {
      console.log(`${helpers.panelTitle} not found`);
    });

    return $(helpers.panelTitle).getText();
  }

  async clickHome(): Promise<AdminDashboardPage> {
    $(helpers.panelHome).catch(() => {
      console.log(`${helpers.panelHome} not found`);
    });

    await $(helpers.panelHome).click();
    return new AdminDashboardPage();
  }
}
