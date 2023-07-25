Feature('Azure screen flow changes - Welsh');

Scenario('Azure screen flow changes - Welsh', async ({ I }) => {
    I.amOnPage('/');
    I.see('Court and tribunal hearings');
    I.click('Continue');
    I.waitForText('What do you want to do?');
    I.click('Sign in');
    I.waitForText('How do you want to sign in?');
    I.click(locate('//a').withText('Cymraeg'));
    I.waitForText('Sut hoffech chi fewngofnodi?');
    I.click('#sign-in-3');
    I.click('Parhau');
    I.waitForText('Mewngofnodi gyda’ch cyfeiriad e-bost');
    I.see('Cyfeiriad e-bost');
    I.see('Cyfrinair');
}).tag('@CrossBrowser');
