import { CommonPage } from "./Common.page";
import { ListDownloadFilesPage } from "./ListDownloadFiles.page";

const helpers = require("../Helpers/Selectors");

export class ListDownloadDisclaimerPage extends CommonPage {
  async tickAgreeCheckbox(): Promise<boolean> {
    $(helpers.AgreeCheckBox).catch(() => {
      console.log(`${helpers.AgreeCheckBox} checkbox not found`);
    });

    await $(helpers.AgreeCheckBox).click();
    return $(helpers.AgreeCheckBox).isSelected();
  }

  async clickContinue(): Promise<ListDownloadFilesPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new ListDownloadFilesPage();
  }
}
