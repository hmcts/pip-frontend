import { CommonPage } from "./Common.page";

const helpers = require("../Helpers/Selectors");

export class BlobViewPublicationsPage extends CommonPage {
  async getFirstPub(): Promise<string> {
    $(helpers.FirstItemResult).catch(() => {
      console.log(`${helpers.FirstItemResult} not found`);
    });
    return $(helpers.FirstItemResult).getAttribute("href");
  }
}
