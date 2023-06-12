import { CommonPage } from './Common.page';
import { AccountHomePage } from './AccountHome.page';
import { SystemAdminDashboardPage } from './SystemAdminDashboard.page';

const helpers = require('../Helpers/Selectors');

export class SignInPage extends CommonPage {
    async getPageTitle(): Promise<string> {
        $(helpers.SearchOptionsTitle).catch(() => {
            console.log(`${helpers.SearchOptionsTitle} not found`);
        });

        return $(helpers.SearchOptionsTitle).getText();
    }

    async clickContinueForRadio1(): Promise<void> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });
        const continueButton = await $(helpers.ContinueButton);
        continueButton.click();
    }

    async clickContinueForRadio2(): Promise<string> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });
        const continueButton = await $(helpers.ContinueButton);
        continueButton.click();

        return 'https://google.com';
    }

    async clickContinueForRadio3(): Promise<void> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });
        const continueButton = await $(helpers.ContinueButton);
        continueButton.click();
    }

    async enterText(text: string, field: string): Promise<void> {
        $(helpers[field]).catch(() => {
            console.log(`${helpers[field]} not found`);
        });

        const inputField = await $(helpers[field]);
        await inputField.addValue(text);
        await browser.keys('Escape');
    }

    async clickSignInAad(): Promise<AccountHomePage> {
        $(helpers.UserLoginContinue).catch(() => {
            console.log(`${helpers.UserLoginContinue} not found`);
        });

        const continueButton = await $(helpers.UserLoginContinue);
        continueButton.click();

        return new AccountHomePage();
    }

    async clickSignInCft(): Promise<AccountHomePage> {
        $(helpers.CftSignInButton).catch(() => {
            console.log(`${helpers.CftSignInButton} not found`);
        });

        const continueButton = await $(helpers.CftSignInButton);
        continueButton.click();

        return new AccountHomePage();
    }

    async clickSystemAdminSignIn(): Promise<SystemAdminDashboardPage> {
        $(helpers.UserLoginContinue).catch(() => {
            console.log(`${helpers.UserLoginContinue} not found`);
        });

        const continueButton = await $(helpers.UserLoginContinue);
        continueButton.click();

        return new SystemAdminDashboardPage();
    }

    async getAdminPageTitle(): Promise<string> {
        $(helpers.AdminPageTitle).catch(() => {
            console.log(`${helpers.AdminPageTitle} not found`);
        });

        return $(helpers.AdminPageTitle).getText();
    }
}
