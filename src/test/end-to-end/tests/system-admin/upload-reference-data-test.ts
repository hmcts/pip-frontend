Feature('System admin upload reference data');

const CSV_FILE_PATH = './shared/mocks/system-admin-upload-reference-data-test.csv';
const INVALID_FILE_PATH = './shared/mocks/reference-data-invalid.csv';

Scenario('I as a system admin should be able to upload reference data manually', async ({ I }) => {
    const LOCATION_ID = '50001';

    I.loginAsSystemAdmin();
    I.see('Upload Reference Data');
    I.click('#card-manual-reference-data-upload');
    I.see(
        'Prior to upload you must ensure the file is suitable for location data upload e.g. ' +
            'file should be in correct formats.'
    );
    I.see('Manually upload a csv file (saved as Comma-separated Values .csv), max size 2MB');
    I.attachFile('#manual-reference-data-upload', CSV_FILE_PATH);
    I.click('Continue');
    I.see('Check upload details');
    I.click('Change');
    I.see('Reference manual data upload');
    I.attachFile('#manual-reference-data-upload', CSV_FILE_PATH);
    I.click('Continue');
    I.click('Confirm');
    I.waitForText('Success');
    I.waitForText('Your file has been uploaded');
    I.see('What do you want to do next?');
    I.see('Upload another file');
    I.click('Upload another file');
    I.see('Reference manual data upload');

    I.handleDownloads('downloadedReferenceData.csv');
    I.click('Download current reference data');
    I.amInPath('../../../functional-output/functional/reports');
    I.seeFile('downloadedReferenceData.csv');
    I.seeInThisFile(LOCATION_ID);
    I.logout();
});

Scenario(
    'I as a system admin should be able to see proper error messages related to upload reference data',
    async ({ I }) => {
        I.loginAsSystemAdmin();
        I.see('Upload Reference Data');
        I.click('#card-manual-reference-data-upload');
        I.click('Continue');
        I.waitForText('Please provide a file');
        I.attachFile('#manual-reference-data-upload', INVALID_FILE_PATH);
        I.click('Continue');
        I.click('Confirm');
        I.waitForText('There is a problem');
        I.waitForText('Unable to upload reference data file, please verify that provided fields are correct');
        I.logout();
    }
);
