import { CommonPage } from "./Common.page";
import { UpdateUserConfirmationPage } from "./UpdateUserConfirmation.page";
const helpers = require("../Helpers/Selectors");

export class UpdateUserPage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }

  async selectUserRole(): Promise<void> {
    $(helpers.roleUpdateSelectBox).catch(() => {
      console.log(`${helpers.roleUpdateSelectBox} not found`);
    });

    await $(helpers.roleUpdateSelectBox).selectByIndex(1);
  }

  async clickContinueButton(): Promise<UpdateUserConfirmationPage> {
    $(helpers.roleUpdateButton).catch(() => {
      console.log(`${helpers.roleUpdateButton} not found`);
    });
    await $(helpers.roleUpdateButton).click();

    return new UpdateUserConfirmationPage();
  }
}
