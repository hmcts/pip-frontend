import {CommonPage} from './Common.page';

const helpers = require('../Helpers/Selectors');

export class CftAuthenticationFailedPage extends CommonPage {

  async getParagraphText(): Promise<string> {
    $(helpers.firstParagraphCftRejected).catch(() => {
      console.log(`${helpers.firstParagraphCftRejected} not found`);
    });

    return $(helpers.firstParagraphCftRejected).getText();
  }
}
