Feature('Banner navigation and links');

Scenario('Unverified user - all banner navigation links should take user to the correct pages', async ({ I }) => {
    I.amOnPage('/view-option');
    I.waitForText('Court and tribunal hearings');
    I.click(locate('//li').withText('Home'));
    I.waitForText('Court and tribunal hearings');
    I.click('Continue');
    I.click(locate('//li').withText('Find a court or tribunal'));
    I.waitForText('What court or tribunal are you interested in?');
    I.click(locate('//a').withText('Cymraeg'));
    I.waitForText('Ym mha lys neu dribiwnlys y mae gennych ddiddordeb?');
    I.click(locate('//a').withText('English'));
    I.click(locate('//li').withText('Single Justice Procedure cases'));
    I.waitForText('What do you want to view from Single Justice Procedure?');
    I.click(locate('//a').withText('Court and tribunal hearings'));
}).tag('@CrossBrowser');

Scenario('Verified user - all banner navigation links should take user to the correct pages', async ({ I }) => {
    I.loginAsMediaUser();
    I.waitForText('Your account');
    I.click(locate('//li').withText('Find a court or tribunal'));
    I.waitForText('What court or tribunal are you interested in?');
    I.click(locate('//li').withText('Single Justice Procedure cases'));
    I.waitForText('What do you want to view from Single Justice Procedure?');
    I.click(locate('//li').withText('Email subscriptions'));
    I.waitForText('Your email subscriptions');
    I.click(locate('//li').withText('Home'));
    I.waitForText('Your account');
    I.logout();
}).tag('@CrossBrowser');

Scenario('Cft user - all banner navigation links should take user to the correct pages', async ({ I }) => {
    I.loginAsCftUser();
    I.waitForText('Your account');
    I.click(locate('//li').withText('Find a court or tribunal'));
    I.waitForText('What court or tribunal are you interested in?');
    I.click(locate('//li').withText('Single Justice Procedure cases'));
    I.waitForText('What do you want to view from Single Justice Procedure?');
    I.click(locate('//li').withText('Email subscriptions'));
    I.waitForText('Your email subscriptions');
    I.click(locate('//li').withText('Home'));
    I.waitForText('Your account');
    I.logout();
}).tag('@CrossBrowser');

Scenario('Admin user - all banner navigation links should take user to the correct pages', async ({ I }) => {
    I.loginAsAdmin();
    I.waitForText('Your Dashboard');
    I.click(locate('//li').withText('Upload'));
    I.waitForText('Manual upload');
    I.click(locate('//li').withText('Review apps'));
    I.waitForText('Select application to assess');
    I.click(locate('//li').withText('Remove'));
    I.waitForText('Find content to remove');
    I.click(locate('//li').withText('Home'));
    I.waitForText('Your Dashboard');
    I.logout();
}).tag('@CrossBrowser');

Scenario('System admin user - all banner navigation links should take user to the correct pages', async ({ I }) => {
    I.loginAsSystemAdmin();
    I.waitForText('System Admin Dashboard');
    I.click(locate('//li').withText('Admin Dashboard'));
    I.waitForText('Your Dashboard');
    I.click(locate('//li').withText('Upload'));
    I.waitForText('Manual upload');
    I.click(locate('//li').withText('Remove'));
    I.waitForText('Find content to remove');
    I.click(locate('//li').withText('Home'));
    I.waitForText('System Admin Dashboard');
    I.logout();
}).tag('@CrossBrowser');

Scenario('Home page links should take user to the correct pages', async ({ I }) => {
    I.amOnPage('/');
    I.waitForText('Court and tribunal hearings');
    I.click(locate('//a').withText('sign in'));
    I.waitForText('How do you want to sign in?');
    I.click(locate('//a').withText('Court and tribunal hearings'));
    I.click(locate('//a').withText('Welsh (Cymraeg)'));
    I.waitForText('Gwrandawiadau llys a thribiwnlys');
    I.click(locate('//a').withText('Saesneg (English)'));
    I.waitForText('Court and tribunal hearings');
}).tag('@CrossBrowser');
