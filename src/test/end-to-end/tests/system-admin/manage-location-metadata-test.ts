import { DateTime } from 'luxon';
import { createLocation, uploadPublication } from '../../shared/testingSupportApi';
import { randomData } from '../../shared/random-data';
import { config as testConfig, config } from '../../../config';
import Assert from 'assert';

Feature('System admin manage location metadata');

const ENGLISH_CAUTION_MESSAGE = 'This is English Caution Message';
const WELSH_CAUTION_MESSAGE = 'This is Welsh Caution Message';
const ENGLISH_NO_LIST_MESSAGE = 'This is English no list message';
const WELSH_NO_LIST_MESSAGE = 'This is Welsh no list message';
const UPDATED_ENGLISH_CAUTION_MESSAGE = 'This is updated English Caution Message';
const UPDATED_ENGLISH_NO_LIST_MESSAGE = 'This is updated English no list message';

Scenario('I as a system admin should be able to create and manage location metadata', async ({ I }) => {
    const displayFrom = DateTime.now().toISO({ includeOffset: false });
    const displayTo = DateTime.now().plus({ days: 1 }).toISO({ includeOffset: false });

    const locationId = randomData.getRandomLocationId();
    const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();

    await createLocation(locationId, locationName);
    const artefactId = await uploadPublication('PUBLIC', locationId, displayFrom, displayFrom, displayTo, 'ENGLISH');

    I.loginAsSsoSystemAdmin();
    I.click('Manage Location Metadata');
    I.waitForText('Find the location metadata to manage');
    I.fillField('#search-input', locationName);
    I.click('Continue', null, { noWaitAfter: true });
    I.waitForText('Manage location metadata for ' + locationName);
    I.fillField('#english-caution-message', ENGLISH_CAUTION_MESSAGE);
    I.fillField('#welsh-caution-message', WELSH_CAUTION_MESSAGE);
    I.fillField('#english-no-list-message', ENGLISH_NO_LIST_MESSAGE);
    I.fillField('#welsh-no-list-message', WELSH_NO_LIST_MESSAGE);
    I.click('Create');
    I.waitForText('Location metadata created');

    I.click('Search for location metadata by court or tribunal name');
    I.waitForText('Find the location metadata to manage');
    I.fillField('#search-input', locationName);
    I.click('Continue', null, { noWaitAfter: true });
    I.waitForText('Manage location metadata for ' + locationName);

    const cautionMessageEnglish = await I.grabTextFrom('#english-caution-message');
    Assert.equal(cautionMessageEnglish, ENGLISH_CAUTION_MESSAGE);

    const cautionMessageWelsh = await I.grabTextFrom('#welsh-caution-message');
    Assert.equal(cautionMessageWelsh, WELSH_CAUTION_MESSAGE);

    const noListMessageEnglish = await I.grabTextFrom('#english-no-list-message');
    Assert.equal(noListMessageEnglish, ENGLISH_NO_LIST_MESSAGE);

    const noListMessageWelsh = await I.grabTextFrom('#welsh-no-list-message');
    Assert.equal(noListMessageWelsh, WELSH_NO_LIST_MESSAGE);

    I.clearField('#english-caution-message');
    I.clearField('#english-no-list-message');

    I.fillField('#english-caution-message', UPDATED_ENGLISH_CAUTION_MESSAGE);
    I.fillField('#english-no-list-message', UPDATED_ENGLISH_NO_LIST_MESSAGE);

    I.click('Update');
    I.waitForText('Location metadata updated');

    I.logoutSsoSystemAdmin();

    I.amOnPage(testConfig.TEST_URL + '/summary-of-publications?locationId=' + locationId);
    I.waitForText('What do you want to view from ' + locationName + '?');
    I.waitForText(UPDATED_ENGLISH_CAUTION_MESSAGE);

    I.click(locate('//a').withText('Cymraeg'));
    I.waitForText(WELSH_CAUTION_MESSAGE);

    await I.deletePublicationByArtefactId(artefactId);

    I.click(locate('//a').withText('English'));
    I.waitForText(UPDATED_ENGLISH_NO_LIST_MESSAGE);
    I.see(UPDATED_ENGLISH_CAUTION_MESSAGE);

    I.click(locate('//a').withText('Cymraeg'));
    I.waitForText(WELSH_NO_LIST_MESSAGE);
    I.see(WELSH_CAUTION_MESSAGE);
    I.click(locate('//a').withText('English'));

    I.clearCookie();
    I.loginAsSsoSystemAdmin();

    I.click('Manage Location Metadata');
    I.waitForText('Find the location metadata to manage');
    I.fillField('#search-input', locationName);
    I.click('Continue', null, { noWaitAfter: true });
    I.waitForText('Manage location metadata for ' + locationName);
    I.see('Update');
    I.see('Delete');
    I.click('Delete');
    I.waitForText('Are you sure you want to delete location metadata for ' + locationName);
    I.click('#delete-location-metadata-confirm');
    I.click('Continue');
    I.waitForText('Location metadata deleted');

    I.click('Search for location metadata by court or tribunal name');
    I.waitForText('Find the location metadata to manage');
    I.fillField('#search-input', locationName);
    I.click('Continue', null, { noWaitAfter: true });
    I.waitForText('Manage location metadata for ' + locationName);
    I.dontSee('Update','#main-content > form > div.govuk-button-group');
    I.dontSee('Delete');
});

Scenario(
    'I as a system admin should be able to see proper information texts and error messages related to location metadata',
    async ({ I }) => {
        const locationId = randomData.getRandomLocationId();
        const locationName = config.TEST_SUITE_PREFIX + randomData.getRandomString();
        await createLocation(locationId, locationName);
        I.loginAsSsoSystemAdmin();
        I.click('Manage Location Metadata');
        I.waitForText('Find the location metadata to manage');
        I.click('Continue', null, { noWaitAfter: true });
        I.waitForText('There is a problem');
        I.see('Court or tribunal name must be 3 characters or more');

        I.fillField('#search-input', locationName);
        I.click('Continue', null, { noWaitAfter: true });

        I.waitForText('Manage location metadata for ' + locationName);
        I.click('Create');
        I.waitForText('There is a problem');
        I.see('Failed to create location metadata');

        I.fillField('#english-caution-message', ENGLISH_CAUTION_MESSAGE);
        I.click('Create');
        I.waitForText('Location metadata created');

        I.click('Search for location metadata by court or tribunal name');
        I.waitForText('Find the location metadata to manage');
        I.fillField('#search-input', locationName);
        I.click('Continue', null, { noWaitAfter: true });
        I.waitForText('Manage location metadata for ' + locationName);
        I.clearField('#english-caution-message');
        I.click('Update');
        I.waitForText('There is a problem');
        I.see('Failed to update location metadata');

        I.click('Delete');
        I.waitForText('Are you sure you want to delete location metadata for ' + locationName);
        I.click('#delete-location-metadata-confirm-2');
        I.click('Continue');
        I.waitForText('Manage location metadata for ' + locationName);
    }
).tag('@Nightly');
