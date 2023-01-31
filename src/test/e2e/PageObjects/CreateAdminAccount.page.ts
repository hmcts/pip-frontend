import { CommonPage } from "./Common.page";
import { CreateAdminAccountSummaryPage } from "./CreateAdminAccountSummary.page";

const helpers = require("../Helpers/Selectors");

export class CreateAdminAccountPage extends CommonPage {
  async completeForm(): Promise<void> {
    await this.inputFirstName();
    await this.inputLastName();
    await this.inputEmailAddress();
    await this.selectUserRole();
  }

  async inputFirstName(): Promise<void> {
    $(helpers.FirstNameInput).catch(() => {
      console.log(`${helpers.FirstNameInput} not found`);
    });

    await $(helpers.FirstNameInput).addValue("Test");
    await browser.keys("Escape");
  }

  async inputLastName(): Promise<void> {
    $(helpers.LastNameInput).catch(() => {
      console.log(`${helpers.LastNameInput} not found`);
    });

    await $(helpers.LastNameInput).addValue("Admin");
    await browser.keys("Escape");
  }

  async inputEmailAddress(): Promise<void> {
    $(helpers.EmailInput).catch(() => {
      console.log(`${helpers.EmailInput} not found`);
    });

    await $(helpers.EmailInput).addValue("pip-auto-test-admin@hmcts.net");
    await browser.keys("Escape");
  }

  async selectUserRole(): Promise<void> {
    await super.selectOption("UserRoleRadio");
  }

  async clickContinue(): Promise<CreateAdminAccountSummaryPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    await $(helpers.ContinueButton).click();

    return new CreateAdminAccountSummaryPage();
  }
}
