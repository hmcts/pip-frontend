const helpers = require('../Helpers/Selectors');

export class CommonPage {
    open(path): Promise<string> {
        return browser.url(path);
    }

    printUrl(): Promise<string> {
        return browser.getUrl();
    }

    async getPageTitle(): Promise<string> {
        $(helpers.CommonPageTitle).catch(() => {
            console.log(`${helpers.CommonPageTitle} not found`);
        });

        return $(helpers.CommonPageTitle).getText();
    }

    async selectOption(optionName: string): Promise<void> {
        $(helpers[optionName]).catch(() => {
            console.log(`${helpers[optionName]} not found`);
        });

        await $(helpers[optionName]).click();
    }

    get radioButtons(): Promise<number> {
        const radioButtons = $$(helpers.RadioButton);
        return radioButtons.length;
    }

    async clickAcceptCookies(): Promise<void> {
        $(helpers.AcceptButton).catch(() => {
            console.log(`${helpers.AcceptButton} not found`);
        });

        await $(helpers.AcceptButton).click();
    }

    async cookieHeader(): Promise<string> {
        $(helpers.CookieHeader).catch(() => {
            console.log(`${helpers.CookieHeader} not found`);
        });

        return $(helpers.CookieHeader).getText();
    }

    async clickHideMessage(): Promise<void> {
        $(helpers.HideMessageButton).catch(() => {
            console.log(`${helpers.HideMessageButton} not found`);
        });

        await $(helpers.HideMessageButton).click();
    }

    async removeOverlay(): Promise<void> {
        await browser.execute(() => {
            document.getElementById('back-to-top-button').remove();
        });
    }
}
