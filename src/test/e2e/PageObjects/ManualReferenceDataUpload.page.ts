import { CommonPage } from './Common.page';
import {ManualReferenceDataUploadSummaryPage} from './ManualReferenceDataUploadSummary.page';
const helpers = require('../Helpers/Selectors');

const path = require('path');

export class ManualReferenceDataUploadPage extends CommonPage {

  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitleXl).catch(() => {
      console.log(`${helpers.CommonPageTitleXl} not found`);
    });

    return $(helpers.CommonPageTitleXl).getText();
  }

  async completeForm(referenceDatafile: string): Promise<void> {
    await this.uploadFile(referenceDatafile);
  }

  async uploadFile(referenceDatafile: string): Promise<void> {
    $(helpers.referenceDataFileUpload).catch(() => {
      console.log(`${helpers.referenceDataFileUpload} not found`);
    });

    const filePath = path.join(__dirname, '../../unit/mocks/' + referenceDatafile);

    await $(helpers.referenceDataFileUpload).setValue(filePath);
  }

  async clickContinue(): Promise<ManualReferenceDataUploadSummaryPage> {
    await this.removeOverlay();
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new ManualReferenceDataUploadSummaryPage();
  }
}
