import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class CaseEventGlossaryPage extends CommonPage {
    async termIsInView(): Promise<boolean> {
        $(helpers.AppealInterpreterSworn).catch(() => {
            console.log(`${helpers.AppealInterpreterSworn} not found`);
        });

        return $(helpers.AppealInterpreterSworn).isDisplayedInViewport();
    }
}
