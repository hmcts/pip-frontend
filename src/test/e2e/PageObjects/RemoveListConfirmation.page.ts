import { CommonPage } from "./Common.page";
import { RemoveListSuccessPage } from "./RemoveListSuccess.page";

const helpers = require("../Helpers/Selectors");

export class RemoveListConfirmationPage extends CommonPage {
  async clickContinueToRemovePublication(): Promise<RemoveListSuccessPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new RemoveListSuccessPage();
  }
}
