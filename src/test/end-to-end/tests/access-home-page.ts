Feature('Home page');

Scenario('I should be able to access the home page', async ({ I }) => {
  I.amOnPage('/');
  I.see('Court and tribunal hearings');
  I.click('Continue');
  I.see('What do you want to do?');
});

