import { CommonPage } from './Common.page';
import {SystemAdminDashboardPage} from './SystemAdminDashboard.page';
const helpers = require('../Helpers/Selectors');

export class DeleteCourtReferenceSuccessPage extends CommonPage {

  async getPageTitle(): Promise<string> {
    $(helpers.panelTitle).catch(() => {
      console.log(`${helpers.panelTitle} not found`);
    });

    return $(helpers.panelTitle).getText();
  }

  async clickHome(): Promise<SystemAdminDashboardPage> {
    $(helpers.panelHome).catch(() => {
      console.log(`${helpers.panelHome} not found`);
    });

    await $(helpers.panelHome).click();
    return new SystemAdminDashboardPage;
  }
}
