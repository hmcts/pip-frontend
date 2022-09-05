import {CommonPage} from './Common.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionConfigureListPage extends CommonPage {

  async jurisdictionChecked(): Promise<boolean> {
    await $(helpers.JurisdictionFilter1).catch(() => {
      console.log(`${helpers.JurisdictionFilter1} not found`);
    });
    const element = await $(helpers.JurisdictionFilter1);

    return element.isSelected();
  }

  async clickApplyFiltersButton(): Promise<SubscriptionConfigureListPage> {
    await $(helpers.ApplyFiltersButton).catch(() => {
      console.log(`${helpers.ApplyFiltersButton} not found`);
    });

    await $(helpers.ApplyFiltersButton).click();
    return new SubscriptionConfigureListPage();
  }

}
