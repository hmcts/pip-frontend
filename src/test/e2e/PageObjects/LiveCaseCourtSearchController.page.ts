import { LiveCaseStatusPage } from './LiveCaseStatus.page';
import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class LiveCaseCourtSearchControllerPage extends CommonPage {
    async getPageTitle(): Promise<string> {
        $(helpers.CommonPageTitle).catch(() => {
            console.log(`${helpers.CommonPageTitle} not found`);
        });

        return $(helpers.CommonPageTitle).getText();
    }

    async selectFirstValidListResult(): Promise<LiveCaseStatusPage> {
        await $(helpers.LiveHearingsTableFirstValidResult).catch(() => {
            console.log(`${helpers.LiveHearingsTableFirstValidResult} not found`);
        });

        const firstValidItem = await $(helpers.LiveHearingsTableFirstValidResult);
        firstValidItem.click();
        return new LiveCaseStatusPage();
    }
}
