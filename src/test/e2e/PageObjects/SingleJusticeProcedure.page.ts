import { CommonPage } from './Common.page';
import { SJPPublicListPage } from './SJPPublicList.page';

const helpers = require('../Helpers/Selectors');

export class SingleJusticeProcedurePage extends CommonPage {
  async clickSOPListItem(): Promise<SJPPublicListPage> {
    $(helpers.SOPListItem).catch(() => {
      console.log(`${helpers.SOPListItem} not found`);
    });

    await $(helpers.SOPListItem).click();
    return new SJPPublicListPage();
  }

}
