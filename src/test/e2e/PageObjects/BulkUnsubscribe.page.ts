import { CommonPage } from "./Common.page";
import { BulkUnsubscribeConfirmationPage } from "./BulkUnsubscribeConfirmation.page";

const helpers = require("../Helpers/Selectors");

export class BulkUnsubscribePage extends CommonPage {
  async clickBulkUnsubscribeButton(): Promise<BulkUnsubscribeConfirmationPage> {
    $(helpers.BulkUnsubscribeButton).catch(() => {
      console.log(`${helpers.BulkUnsubscribeButton} not found`);
    });
    await $(helpers.BulkUnsubscribeButton).scrollIntoView();
    await $(helpers.BulkUnsubscribeButton).click();
    return new BulkUnsubscribeConfirmationPage();
  }

  async courtSubscriptionChecked(): Promise<boolean> {
    await $(helpers.CourtSubscriptionCheckbox1).catch(() => {
      console.log(`${helpers.CourtSubscriptionCheckbox1} not found`);
    });
    const element = await $(helpers.CourtSubscriptionCheckbox1);

    return element.isSelected();
  }
}
