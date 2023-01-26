import { CommonPage } from "./Common.page";
import { UpdateUserPage } from "./UpdateUser.page";
import { DeleteUserPage } from "./DeleteUser.page";
const helpers = require("../Helpers/Selectors");

export class ManageUserPage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }

  async clickChangeLink(): Promise<UpdateUserPage> {
    $(helpers.changeLink).catch(() => {
      console.log(`${helpers.changeLink} not found`);
    });
    await $(helpers.changeLink).click();
    return new UpdateUserPage();
  }

  async clickDeleteUserButton(): Promise<DeleteUserPage> {
    $(helpers.deleteUserButton).catch(() => {
      console.log(`${helpers.deleteUserButton} not found`);
    });
    await $(helpers.deleteUserButton).click();

    return new DeleteUserPage();
  }
}
