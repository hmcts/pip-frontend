import { CommonPage } from "./Common.page";
import { SJPPublicListPage } from "./SJPPublicList.page";

const helpers = require("../Helpers/Selectors");

export class SingleJusticeProcedurePage extends CommonPage {
  async clickSjpPublicListItem(): Promise<SJPPublicListPage> {
    $(helpers.SjpPublicListItem).catch(() => {
      console.log(`${helpers.SjpPublicListItem} not found`);
    });

    await $(helpers.SjpPublicListItem).click();
    return new SJPPublicListPage();
  }
}
