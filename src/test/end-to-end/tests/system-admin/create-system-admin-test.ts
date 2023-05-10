import { randomData } from '../../shared/random-data';
import { createSystemAdminAccount, deleteAllAccountsByEmailAndRoles } from '../../shared/testingSupportApi';
import { config as testConfig } from '../../../config';

Feature('Create system admin');

const TEST_WORKER_NUMBER = randomData.getRandomNumber(10000000, 99999999);
const TEST_FIRST_NAME = testConfig.TEST_SUITE_PREFIX + 'FirstName';
const TEST_SURNAME = testConfig.TEST_SUITE_PREFIX + 'Surname';

Scenario('I as a system admin should be able to create a new system admin', async ({ I }) => {
    const email = randomData.getRandomEmailAddress(TEST_WORKER_NUMBER);

    I.loginAsSystemAdmin();
    I.see('System Admin Dashboard');
    I.createNewSystemAdminAndContinue(TEST_FIRST_NAME, TEST_SURNAME, email);
    I.waitForText('Check account details');
    I.see(TEST_FIRST_NAME);
    I.see(TEST_SURNAME);
    I.see(email);

    I.click('Change');
    I.waitForText('Create system admin account');
    I.fillField('#firstName', TEST_FIRST_NAME + '1');
    I.click('Continue');
    I.waitForText('Check account details');
    I.click('Confirm');
    I.waitForText('Account has been created');
    I.see(TEST_FIRST_NAME);
    I.see(TEST_SURNAME);
    I.see(email);
});

Scenario('I as a system admin should not be able to create duplicated system admin account', async ({ I }) => {
    const email = randomData.getRandomEmailAddress(TEST_WORKER_NUMBER);
    await createSystemAdminAccount(TEST_FIRST_NAME, TEST_SURNAME, email);

    I.loginAsSystemAdmin();
    I.see('System Admin Dashboard');
    I.createNewSystemAdminAndContinue(TEST_FIRST_NAME, TEST_SURNAME, email);
    I.waitForText('Check account details');
    I.click('Confirm');
    I.waitForText('Account has been rejected');
    I.see(
        'This user already has an account. If the user requires a system admin account, their previous account will need to be deleted first before one can be created.'
    );
});

Scenario(
    'I as a system admin should not be able to create a new system admin if the maximum number of accounts has been reached',
    async ({ I }) => {
        // Continue creating new system admins until we see the 'above max system admin' error
        let response = await createSystemAdminAccount(
            TEST_FIRST_NAME,
            TEST_SURNAME,
            randomData.getRandomEmailAddress(TEST_WORKER_NUMBER)
        );
        while (!response?.error && !response?.aboveMaxSystemAdmin) {
            response = await createSystemAdminAccount(
                TEST_FIRST_NAME,
                TEST_SURNAME,
                randomData.getRandomEmailAddress(TEST_WORKER_NUMBER)
            );
        }

        I.loginAsSystemAdmin();
        I.see('System Admin Dashboard');
        I.createNewSystemAdminAndContinue(
            TEST_FIRST_NAME,
            TEST_SURNAME,
            randomData.getRandomEmailAddress(TEST_WORKER_NUMBER)
        );
        I.waitForText('Check account details');
        I.click('Confirm');
        I.waitForText('Account has been rejected');
        I.see('The maximum number of System Admin accounts has been reached.');
    }
).tag('@Nightly');

Scenario('I as a system admin should be able to see error messages when input fields are incorrect', async ({ I }) => {
    I.loginAsSystemAdmin();
    I.see('System Admin Dashboard');
    I.click('Create System Admin');
    I.waitForText('Create system admin account');
    I.click('Continue');
    I.waitForText('There is a problem');
    I.see('Enter first name');
    I.see('Enter last name');
    I.see('Enter email address');

    I.click('Home');
    I.see('System Admin Dashboard');
    I.createNewSystemAdminAndContinue(TEST_FIRST_NAME, TEST_SURNAME, testConfig.TEST_SUITE_PREFIX);
    I.waitForText('There is a problem');
    I.see('Enter an email address in the correct format, like name@example.com');
});

AfterSuite(async () => {
    // Due to the tests being run in 4 workers in parallel, we only delete the accounts for individual worker to
    // avoid deleting accounts for tests which have not finished running.
    await deleteAllAccountsByEmailAndRoles(testConfig.TEST_SUITE_PREFIX + TEST_WORKER_NUMBER, 'SYSTEM_ADMIN');
});