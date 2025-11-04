import { config as testConfig } from '../../config';

Feature('Banner navigation and links');

Scenario('Unverified user - all banner navigation links should take user to the correct pages', async ({ I }) => {
    I.usePlaywrightTo('Go to search page', async ({ page }) => {
        page.goto(testConfig.TEST_URL + '/view-option');
    });
    I.waitForText('What do you want to do?');
    I.click(locate('//a').withText('Court and tribunal hearings'));
    I.waitForText('Court and tribunal hearings');
    I.click('Continue');
    I.waitForText('What do you want to do?');
    I.click('Find a court or tribunal');
    I.click('Continue');
    I.waitForText('What court or tribunal are you interested in?');
    I.click(locate('//a').withText('Cymraeg'));
    I.waitForText('Ym mha lys neu dribiwnlys y mae gennych ddiddordeb?');

    I.click(locate('//a').withText('English'));
    I.click(locate('//a').withText('Court and tribunal hearings'));
    I.waitForText('Court and tribunal hearings');
    I.click('Continue');
    I.waitForText('What do you want to do?');
    I.click('Find a Single Justice Procedure case');
    I.click('Continue');
    I.waitForText('What do you want to view from Single Justice Procedure?');
}).tag('@CrossBrowser');

Scenario('Verified user - all banner navigation links should take user to the correct pages', async ({ I }) => {
    I.loginAsMediaUser();
    I.click(locate('//li').withText('Email subscriptions'));
    I.waitForText('Your email subscriptions');
    I.click(locate('//li').withText('Dashboard'));
    I.waitForText('Your account');
    I.logout();
}).tag('@CrossBrowser');

Scenario('Admin user - all banner navigation links should take user to the correct pages', async ({ I }) => {
    I.loginAsSsoAdminLocal();
    I.click(locate('//li').withText('Dashboard'));
    I.waitForText('Your Dashboard');
    I.logoutSsoAdminLocal();
}).tag('@CrossBrowser');

Scenario('System admin user - all banner navigation links should take user to the correct pages', async ({ I }) => {
    I.loginAsSsoSystemAdmin();
    I.click(locate('//li').withText('Admin Dashboard'));
    I.waitForText('Your Dashboard');
    I.click(locate('//li').withText('Dashboard'));
    I.waitForText('System Admin Dashboard');
    I.logoutSsoSystemAdmin();
}).tag('@CrossBrowser');

Scenario('Home page links should take user to the correct pages', async ({ I }) => {
    I.usePlaywrightTo('Go to home page', async ({ page }) => {
        page.goto(testConfig.TEST_URL + '/');
    });
    I.waitForText('Court and tribunal hearings');
    I.click(locate('//a').withText('sign in'));
    I.waitForText('How do you want to sign in?');
    I.click(locate('//a').withText('Court and tribunal hearings'));
    I.click(locate('//a').withText('Welsh (Cymraeg)'));
    I.waitForText('Gwrandawiadau llys a thribiwnlys');
    I.click(locate('//a').withText('Saesneg (English)'));
    I.waitForText('Court and tribunal hearings');
})
    .tag('@CrossBrowser')
    .tag('@Smoke');
