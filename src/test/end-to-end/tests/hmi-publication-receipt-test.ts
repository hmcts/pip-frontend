import { DateTime } from 'luxon';

Feature('HMI publication receipt');

Scenario('I should be able to confirm HMI publication is received successfully for the current date', async ({ I }) => {
    const dateYesterday = DateTime.now().minus({ days: 1 }).toFormat('dd MMMM yyyy');
    const locationName = 'HMI AUTOMATED TEST COURT';

    I.amOnPage('/search');
    I.see('What court or tribunal are you interested in?');
    I.fillField('#search-input', locationName);
    I.pressKey('Escape');
    I.click('Continue');
    I.waitForText('What do you want to view from ' + locationName);
    I.see('Care Standards Tribunal Hearing List ' + dateYesterday);
}).tag('@Nightly');
