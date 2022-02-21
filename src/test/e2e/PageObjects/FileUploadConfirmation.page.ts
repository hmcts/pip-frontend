import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class FileUploadConfirmationPage extends CommonPage {
  async getPanelTitle(): Promise<string> {
    $(helpers.PanelTitle).catch(() => {
      console.log(`${helpers.PanelTitle} not found`);
    });

    return $(helpers.PanelTitle).getText();
  }
}
