import { CommonPage } from './Common.page';
import {DeleteCourtReferenceConfirmationPage} from './DeleteCourtReferenceConfirmation.page';
const helpers = require('../Helpers/Selectors');

export class DeleteCourtReferenceDataPage extends CommonPage {

  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }

  async clickDeleteCourtLink(): Promise<DeleteCourtReferenceConfirmationPage> {
    await this.removeOverlay();
    $(helpers.DeleteCourtLink).catch(() => {
      console.log(`${helpers.DeleteCourtLink} not found`);
    });

    await $(helpers.DeleteCourtLink).click();
    return new DeleteCourtReferenceConfirmationPage();
  }
}
