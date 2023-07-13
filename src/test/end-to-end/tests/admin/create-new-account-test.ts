import { randomData } from '../../shared/random-data';
import { config as testConfig } from '../../../config';

Feature('Admin create new account');

const TEST_FIRST_NAME = testConfig.TEST_SUITE_PREFIX + 'FirstName';
const TEST_LAST_NAME = testConfig.TEST_SUITE_PREFIX + 'Surname';

Scenario('I as an admin user should be able to create new account', async ({ I }) => {
    const emailInternalSuperAdminCTSC = randomData.getRandomEmailAddress();
    const emailInternalSuperAdminLocal = randomData.getRandomEmailAddress();
    const emailInternalAdminCTSC = randomData.getRandomEmailAddress();
    const emailInternalAdminLocal = randomData.getRandomEmailAddress();

    I.loginAsAdmin();
    I.waitForText('Your Dashboard');
    I.see('Create accounts for: CTSC Super Admin, Local Super Admin, CTSC Admin, Local Admin.');
    I.click('#card-create-admin-account');
    I.waitForText('Create admin account');
    I.fillField('#firstName', TEST_FIRST_NAME);
    I.fillField('#lastName', TEST_LAST_NAME);
    I.fillField('#emailAddress', emailInternalSuperAdminCTSC);
    I.click('#user-role');
    I.click('Continue');
    I.waitForText('Check account details');
    I.see(TEST_FIRST_NAME);
    I.see(TEST_LAST_NAME);
    I.see(emailInternalSuperAdminCTSC);
    I.see('Internal - Super Administrator - CTSC');
    I.click('Confirm');
    I.waitForText('Account has been created');
    I.see('What happens next');
    I.see('This account will be created and the applicant will be notified to set up their account.');
    I.deleteAdminAccount(emailInternalSuperAdminCTSC);

    I.click('Home');
    I.click('#card-create-admin-account');
    I.waitForText('Create admin account');
    I.fillField('#firstName', TEST_FIRST_NAME);
    I.fillField('#lastName', TEST_LAST_NAME);
    I.fillField('#emailAddress', emailInternalSuperAdminLocal);
    I.click('#user-role-2');
    I.click('Continue');
    I.waitForText('Check account details');
    I.see(TEST_FIRST_NAME);
    I.see(TEST_LAST_NAME);
    I.see(emailInternalSuperAdminLocal);
    I.see('Internal - Super Administrator - Local');
    I.click('Confirm');
    I.waitForText('Account has been created');
    I.see('What happens next');
    I.see('This account will be created and the applicant will be notified to set up their account.');
    I.deleteAdminAccount(emailInternalSuperAdminLocal);

    I.click('Home');
    I.click('#card-create-admin-account');
    I.waitForText('Create admin account');
    I.fillField('#firstName', TEST_FIRST_NAME);
    I.fillField('#lastName', TEST_LAST_NAME);
    I.fillField('#emailAddress', emailInternalAdminCTSC);
    I.click('#user-role-3');
    I.click('Continue');
    I.waitForText('Check account details');
    I.see(TEST_FIRST_NAME);
    I.see(TEST_LAST_NAME);
    I.see(emailInternalAdminCTSC);
    I.see('Internal - Administrator - CTSC');
    I.click('Confirm');
    I.waitForText('Account has been created');
    I.see('What happens next');
    I.see('This account will be created and the applicant will be notified to set up their account.');
    I.deleteAdminAccount(emailInternalAdminCTSC);

    I.click('Home');
    I.click('#card-create-admin-account');
    I.waitForText('Create admin account');
    I.fillField('#firstName', TEST_FIRST_NAME);
    I.fillField('#lastName', TEST_LAST_NAME);
    I.fillField('#emailAddress', emailInternalAdminLocal);
    I.click('#user-role-4');
    I.click('Continue');
    I.waitForText('Check account details');
    I.see(TEST_FIRST_NAME);
    I.see(TEST_LAST_NAME);
    I.see(emailInternalAdminLocal);
    I.see('Internal - Administrator - Local');
    I.click('Confirm');
    I.waitForText('Account has been created');
    I.see('What happens next');
    I.see('This account will be created and the applicant will be notified to set up their account.');
    I.deleteAdminAccount(emailInternalAdminLocal);

    I.logout();
});

Scenario('I as an admin user should be able to see all error messages related to create new account', async ({ I }) => {
    const testEmail = randomData.getRandomEmailAddress();

    I.loginAsAdmin();
    I.waitForText('Your Dashboard');
    I.see('Create accounts for: CTSC Super Admin, Local Super Admin, CTSC Admin, Local Admin.');
    I.click('#card-create-admin-account');
    I.waitForText('Create admin account');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.see('Enter first name');
    I.see('Enter last name');
    I.see('Enter email address');
    I.see('Enter email address');
    I.see('Select a role');
    I.fillField('#firstName', TEST_FIRST_NAME);
    I.fillField('#lastName', TEST_LAST_NAME);
    I.fillField('#emailAddress', testEmail);
    I.click('#user-role');
    I.click('Continue');
    I.waitForText('Check account details');
    I.see(TEST_FIRST_NAME);
    I.see(TEST_LAST_NAME);
    I.see(testEmail);
    I.see('Internal - Super Administrator - CTSC');

    I.click(locate('//div').withText('User role').find('a').withText('Change'));
    I.click('#user-role-3');
    I.click('Continue');
    I.waitForText('Check account details');
    I.see('Internal - Administrator - CTSC');
    I.click('Confirm');
    I.waitForText('Account has been created');

    I.click('Home');
    I.click('#card-create-admin-account');
    I.fillField('#firstName', TEST_FIRST_NAME);
    I.fillField('#lastName', TEST_LAST_NAME);
    I.fillField('#emailAddress', testEmail);
    I.click('#user-role-3');
    I.click('Continue');
    I.waitForText('Check account details');
    I.click('Confirm');
    I.waitForText('There is a problem');
    I.see('This email already exists. The user should try signing in using this email or reset their password.');

    I.deleteAdminAccount(testEmail);

    I.logout();
});
