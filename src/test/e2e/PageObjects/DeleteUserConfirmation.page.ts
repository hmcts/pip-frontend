import { CommonPage } from './Common.page';
const helpers = require('../Helpers/Selectors');

export class DeleteUserConfirmationPage extends CommonPage {
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
}
