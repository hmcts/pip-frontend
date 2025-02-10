import { DateTime } from 'luxon';
import {config as testConfig} from "../../config";

Feature('HMI publication receipt');

Scenario('I should be able to confirm HMI publication is received successfully for the current date', async ({ I }) => {
    const expectedDate = DateTime.now().toFormat('dd MMMM yyyy');
    const locationName = 'HMI AUTOMATED TEST COURT';

    I.usePlaywrightTo('Go to search page', async ({ page }) => {
        page.goto(testConfig.TEST_URL + '/search');
    });
    I.see('What court or tribunal are you interested in?');
    I.fillField('#search-input', locationName);
    I.pressKey('Escape');
    I.click('Continue');
    I.waitForText('What do you want to view from ' + locationName);
    I.see('Care Standards Tribunal Hearing List ' + expectedDate);
}).tag('@Nightly');
