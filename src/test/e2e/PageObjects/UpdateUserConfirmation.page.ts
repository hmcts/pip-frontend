import { CommonPage } from './Common.page';
import { SystemAdminDashboardPage } from './SystemAdminDashboard.page';
const helpers = require('../Helpers/Selectors');

export class UpdateUserConfirmationPage extends CommonPage {
    async getPageTitle(): Promise<string> {
        $(helpers.userManagementPanelTitle).catch(() => {
            console.log(`${helpers.userManagementPanelTitle} not found`);
        });

        return $(helpers.userManagementPanelTitle).getText();
    }

    async getPanelBody(): Promise<string> {
        $(helpers.userManagementPanelBody).catch(() => {
            console.log(`${helpers.userManagementPanelBody} not found`);
        });

        return $(helpers.userManagementPanelBody).getText();
    }

    async clickDashboardLink(): Promise<SystemAdminDashboardPage> {
        $(helpers.redirectToDashboardLink).catch(() => {
            console.log(`${helpers.redirectToDashboardLink} not found`);
        });
        await $(helpers.redirectToDashboardLink).click();
        return new SystemAdminDashboardPage();
    }
}
