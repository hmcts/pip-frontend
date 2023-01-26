import { CommonPage } from "./Common.page";
import { MediaAccountReviewPage } from "./MediaAccountReview.page";

const helpers = require("../Helpers/Selectors");

export class MediaAccountRequestsPage extends CommonPage {
  async clickViewApplication(): Promise<MediaAccountReviewPage> {
    await $(helpers.MediaAccountView).catch(() => {
      console.log(`${helpers.MediaAccountView} not found`);
    });

    await $(helpers.MediaAccountView).click();
    return new MediaAccountReviewPage();
  }
}
