import { CommonPage } from './Common.page';
import { ListDownloadDisclaimerPage } from './ListDownloadDisclaimer.page';

const helpers = require('../Helpers/Selectors');

export class SJPPublicListPage extends CommonPage {
    async clickDownloadACopyButton(): Promise<ListDownloadDisclaimerPage> {
        $(helpers.DownloadACopyButton).catch(() => {
            console.log(`${helpers.DownloadACopyButton} not found`);
        });
        await $(helpers.DownloadACopyButton).click();
        return new ListDownloadDisclaimerPage();
    }
}
