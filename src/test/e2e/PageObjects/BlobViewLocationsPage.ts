import { CommonPage } from './Common.page';
import { ManualReferenceDataUploadSummaryPage } from './ManualReferenceDataUploadSummary.page';

const helpers = require('../Helpers/Selectors');

const path = require('path');

export class BlobViewLocationsPage extends CommonPage {

  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitleXl).catch(() => {
      console.log(`${helpers.CommonPageTitleXl} not found`);
    });

    return $(helpers.CommonPageTitleXl).getText();
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
