import fs from 'fs';
import { stringify } from 'csv';
import { randomData } from '../../shared/random-data';

Feature('Bulk create media accounts');

Scenario('I as a system admin should be able to bulk create media accounts', async ({ I }) => {
    const validUser1 = randomData.getRandomEmailAddress();
    const validUser2 = randomData.getRandomEmailAddress();
    const fileName = 'src/test/end-to-end/shared/mocks/bulkCreateUser.csv';

    const columns = {
        email: 'email',
        firstName: 'firstName',
        surname: 'surname',
    };

    const data = [
        { email: validUser1, firstName: 'John', surname: '11' },
        { email: validUser2, firstName: 'John', surname: '22' },
    ];

    stringify(data, { header: true, columns: columns }, (err, output) => {
        if (err) throw err;
        fs.writeFile(fileName, output, err => {
            if (err) throw err;
        });
    });

    I.loginAsSsoSystemAdmin();
    I.click('#card-bulk-create-media-accounts');
    I.waitForText('Bulk create media accounts');
    I.see('Upload a csv file containing a list of media accounts to be created.');
    I.see('Each record must include the email, first name and surname information.');
    I.see("The file must also have the header 'email,firstName,surname'.");
    I.see(
        'Note the upload process has a maximum of 30 accounts created per run. Please ensure the file uploaded for processing has no more than 30 cases.'
    );
    I.attachFile('#bulk-account-upload', './shared/mocks/bulkCreateUser.csv');
    I.click('Continue');
    I.waitForText('Create media accounts confirmation');
    I.see(validUser1);
    I.see(validUser2);
    I.see('Are you sure you want to create these media accounts?');
    I.click('#yes');
    I.click('Continue');
    I.waitForText('Media accounts created');
    I.see('The file has been uploaded successfully and all accounts have been created');
    I.see('What do you want to do next?');
    I.see('Upload another file');
    I.see('Dashboard');

    I.click('Dashboard');
    I.waitForText('System Admin Dashboard');
    I.click('#card-user-management');
    I.fillField('#email', validUser1);
    I.click('Apply filters');
    I.click(locate('//tr').withText(validUser1).find('a').withText('Manage'));
    I.waitForText('Ensure authorisation has been granted before updating this user');
    I.click('Delete user');
    I.click('#delete-user-confirm');
    I.click('Continue');
    I.waitForText('User Deleted');

    I.click('Dashboard');
    I.waitForText('System Admin Dashboard');
    I.click('#card-user-management');
    I.fillField('#email', validUser2);
    I.click('Apply filters');
    I.click(locate('//tr').withText(validUser2).find('a').withText('Manage'));
    I.waitForText('Ensure authorisation has been granted before updating this user');
    I.click('Delete user');
    I.click('#delete-user-confirm');
    I.click('Continue');
    I.waitForText('User Deleted');

    I.logoutSsoSystemAdmin();
});

Scenario(
    'I as a system admin should be able to see proper error messages related to bulk create media accounts ',
    async ({ I }) => {
        I.loginAsSsoSystemAdmin();
        I.click('#card-bulk-create-media-accounts');
        I.waitForText('Bulk create media accounts');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('Please provide a file');

        I.attachFile('#bulk-account-upload', './shared/mocks/bulkCreateUserTooMany.csv');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('Too many accounts, please upload a file with 30 accounts or less');

        I.attachFile('#bulk-account-upload', './shared/mocks/bulkCreateUserNoHeader.csv');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('Invalid header in file');

        I.attachFile('#bulk-account-upload', './shared/mocks/bulkCreateUserHeaderTypo.csv');
        I.click('Continue');
        I.waitForText('There is a problem');
        I.see('Invalid header in file');

        I.attachFile('#bulk-account-upload', './shared/mocks/bulkCreateUserValid.csv');
        I.click('Continue');
        I.waitForText('Create media accounts confirmation');
        I.see('Are you sure you want to create these media accounts?');
        I.click('#no');
        I.click('Continue');
        I.waitForText('Bulk create media accounts');

        I.logoutSsoSystemAdmin();
    }
).tag('@Nightly');
