import { CommonPage } from './Common.page';
import { MediaAccountReviewPage } from './MediaAccountReview.page';

const helpers = require('../Helpers/Selectors');

export class MediaAccountApprovalPage extends CommonPage {
  async selectNo(): Promise<void> {
    $(helpers.MediaAccountApprovalNo).catch(() => {
      console.log(`${helpers.MediaAccountApprovalNo} not found`);
    });

    await $(helpers.MediaAccountApprovalNo).click();
  }

  async clickContinue(): Promise<MediaAccountReviewPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new MediaAccountReviewPage();
  }
}
