import { CommonPage } from './Common.page';
import { FileUploadConfirmationPage } from './FileUploadConfirmation.page';

const helpers = require('../Helpers/Selectors');

export class ManualReferenceDataUploadSummaryPage extends CommonPage {
  async clickContinue(): Promise<FileUploadConfirmationPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new FileUploadConfirmationPage();
  }
}
