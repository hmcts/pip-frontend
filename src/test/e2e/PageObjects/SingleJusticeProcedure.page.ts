import { CommonPage } from './Common.page';
import { SjpPublicListPage } from './SjpPublicList.page';

const helpers = require('../Helpers/Selectors');

export class SingleJusticeProcedurePage extends CommonPage {
    async clickSjpPublicListItem(): Promise<SjpPublicListPage> {
        $(helpers.SjpPublicListItem).catch(() => {
            console.log(`${helpers.SjpPublicListItem} not found`);
        });

        await $(helpers.SjpPublicListItem).click();
        return new SjpPublicListPage();
    }
}
