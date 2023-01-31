import { CommonPage } from "./Common.page";
import { BulkCreateMediaAccountsConfirmationPage } from "./BulkCreateMediaAccountsConfirmation.page";

const helpers = require("../Helpers/Selectors");
const path = require("path");

export class BulkCreateMediaAccountsPage extends CommonPage {
  async uploadFile(): Promise<void> {
    $(helpers.BulkMediaAccountsFileUpload).catch(() => {
      console.log(`${helpers.BulkMediaAccountsFileUpload} not found`);
    });

    const filePath = path.join(
      __dirname,
      "../../unit/mocks/testBulkMediaUpload.csv"
    );
    await $(helpers.BulkMediaAccountsFileUpload).setValue(filePath);
  }

  async clickContinue(): Promise<BulkCreateMediaAccountsConfirmationPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new BulkCreateMediaAccountsConfirmationPage();
  }
}
