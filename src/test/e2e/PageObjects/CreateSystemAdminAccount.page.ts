import { CommonPage } from "./Common.page";
import { CreateSystemAdminAccountSummaryPage } from "./CreateSystemAdminAccountSummary.page";

const helpers = require("../Helpers/Selectors");

export class CreateSystemAdminAccountPage extends CommonPage {
  async completeForm(): Promise<void> {
    await this.inputFirstName();
    await this.inputLastName();
    await this.inputEmailAddress();
  }

  async inputFirstName(): Promise<void> {
    $(helpers.FirstNameInput).catch(() => {
      console.log(`${helpers.FirstNameInput} not found`);
    });

    await $(helpers.FirstNameInput).setValue("Test");
    await browser.keys("Escape");
  }

  async inputLastName(): Promise<void> {
    $(helpers.LastNameInput).catch(() => {
      console.log(`${helpers.LastNameInput} not found`);
    });

    await $(helpers.LastNameInput).setValue("Name");
    await browser.keys("Escape");
  }

  async inputEmailAddress(): Promise<void> {
    $(helpers.EmailInput).catch(() => {
      console.log(`${helpers.EmailInput} not found`);
    });

    await $(helpers.EmailInput).setValue("ThisIsADummyAccount@justice.gov.uk");
    await browser.keys("Escape");
  }

  async clickContinue(): Promise<CreateSystemAdminAccountSummaryPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    await $(helpers.ContinueButton).click();

    return new CreateSystemAdminAccountSummaryPage();
  }
}
