import { CommonPage } from "./Common.page";
import { ManageUserPage } from "./ManageUser.page";
const helpers = require("../Helpers/Selectors");

export class UserManagementPage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }

  async inputEmail(): Promise<void> {
    $(helpers.EmailField).catch(() => {
      console.log(`${helpers.EmailField} not found`);
    });

    await $(helpers.EmailField).addValue("pip-auto-test-admin@hmcts.net");
    await browser.keys("Escape");
  }

  async clickFilterButton(): Promise<void> {
    $(helpers.applyFiltersButton).catch(() => {
      console.log(`${helpers.applyFiltersButton} not found`);
    });
    await $(helpers.applyFiltersButton).click();
  }

  async clickManageLink(): Promise<ManageUserPage> {
    $(helpers.manageLink).catch(() => {
      console.log(`${helpers.manageLink} not found`);
    });
    await $(helpers.manageLink).click();
    return new ManageUserPage();
  }
}
