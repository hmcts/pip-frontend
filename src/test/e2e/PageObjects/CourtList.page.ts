import { CommonPage } from "./Common.page";

const helpers = require("../Helpers/Selectors");

export class CourtListPage extends CommonPage {
  async clickFirstTableHeaderButton(): Promise<void> {
    $(helpers.ListTableFirstHeaderButton).catch(() => {
      console.log(`${helpers.ListTableFirstHeaderButton} not found`);
    });

    await $(helpers.ListTableFirstHeaderButton).click();
  }

  async getFirstTableRowFirstCell(): Promise<string> {
    $(helpers.ListTableFirstRowFirstCell).catch(() => {
      console.log(`${helpers.ListTableFirstRowFirstCell} not found`);
    });

    return await $(helpers.ListTableFirstRowFirstCell).getText();
  }

  async getLastTableRowFirstCell(): Promise<string> {
    $(helpers.ListTableLastRowFirstCell).catch(() => {
      console.log(`${helpers.ListTableLastRowFirstCell} not found`);
    });

    return await $(helpers.ListTableLastRowFirstCell).getText();
  }
}
