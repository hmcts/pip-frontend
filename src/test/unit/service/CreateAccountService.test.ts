import { CreateAccountService } from '../../../main/service/CreateAccountService';
import sinon from 'sinon';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';
import { multerFile } from '../mocks/multerFile';
import fs from 'fs';

const createAccountService = new CreateAccountService();

const validImage = multerFile('testImage.png', 1000);
const invalidFileType = multerFile('testImage.wrong', 1000);

const validBody = {
    fullName: 'foo bar',
    emailAddress: 'bar@mail.com',
    employer: 'baz',
    tcbox: 'checked',
};
const invalidBody = {
    fullName: '',
    emailAddress: 'bar',
    employer: '',
    tcbox: null,
};

const responseErrors = {
    nameError: {
        message: 'There is a problem - Full name field must be populated',
        href: '#fullName',
        value: '',
    },
    emailError: {
        message: 'There is a problem - Enter an email address in the correct format, like name@example.com',
        href: '#emailAddress',
        value: 'bar',
    },
    employerError: {
        message: 'There is a problem - Your employers name will be needed to support your application for an account',
        href: '#employer',
        value: '',
    },
    fileUploadError: {
        message: 'There is a problem - ID evidence must be a JPG, PDF or PNG',
        href: '#file-upload',
    },
    checkBoxError: {
        message: 'There is a problem - You must check the box to confirm you agree to the terms and conditions.',
        href: '#tcbox',
        value: true,
    },
};
const responseNoErrors = {
    nameError: {
        message: null,
        href: '#fullName',
        value: 'foo bar',
    },
    emailError: {
        message: null,
        href: '#emailAddress',
        value: 'bar@mail.com',
    },
    employerError: {
        message: null,
        href: '#employer',
        value: 'baz',
    },
    fileUploadError: {
        message: null,
        href: '#file-upload',
    },
    checkBoxError: {
        message: null,
        href: '#tcbox',
        value: true,
    },
};

const validMediaPayload = {
    emailAddress: 'a@b.com',
    fullName: 'This is a full name',
};

const validMediaConvertedPayload = [
    {
        email: 'a@b.com',
        firstName: 'This is a full name',
        role: 'VERIFIED',
    },
];

const azureResponse = {
    CREATED_ACCOUNTS: [
        {
            email: 'email',
            azureAccountId: 'azureAccountId',
            roles: 'role',
        },
    ],
};
const validEmail = 'joe@bloggs.com';
const createAzureAccountStub = sinon.stub(AccountManagementRequests.prototype, 'createAzureAccount');
const createPIAccStub = sinon.stub(AccountManagementRequests.prototype, 'createPIAccount');
const createMediaAccStub = sinon.stub(AccountManagementRequests.prototype, 'createMediaApplication');
const bulkCreateAccountsStub = sinon.stub(AccountManagementRequests.prototype, 'bulkCreateMediaAccounts');

const englishLanguage = 'en';
const createMediaAccountLanguageFile = 'create-media-account';
const bulkCreateMediaAccountsLanguageFile = 'bulk-create-media-accounts';

describe('Create Account Service', () => {
    describe('isValidEmail', () => {
        it('should return false if invalid email format is provided', () => {
            expect(createAccountService.isValidEmail('joe.bloggs@mail')).toBe(false);
        });

        it('should return true if valid email format is provided', () => {
            expect(createAccountService.isValidEmail('joe.bloggs@hotmail.com')).toBe(true);
        });
    });

    describe('validateEmail', () => {
        it('should return null if valid email is provided', () => {
            expect(
                createAccountService.validateEmail(
                    'joe.bloggs@hotmail.com',
                    englishLanguage,
                    createMediaAccountLanguageFile
                )
            ).toBe(null);
        });

        it('should return error message if invalid email is provided', () => {
            expect(
                createAccountService.validateEmail('joe.bloggs@mail', englishLanguage, createMediaAccountLanguageFile)
            ).toBe('There is a problem - Enter an email address in the correct format, like name@example.com');
        });

        it('should return error message if email is not provided', () => {
            expect(createAccountService.validateEmail('', englishLanguage, createMediaAccountLanguageFile)).toBe(
                'There is a problem - Email address field must be populated'
            );
        });
    });

    describe('isNotBlank', () => {
        it('should return true', () => {
            expect(createAccountService.isNotBlank('foo')).toBe(true);
        });

        it('should return false', () => {
            expect(createAccountService.isNotBlank('')).toBe(false);
        });

        it('should return false', () => {
            const blank = null;
            expect(createAccountService.isNotBlank(blank)).toBe(false);
        });
    });

    describe('validateMediaFullName', () => {
        it('should return null if no errors', () => {
            expect(
                createAccountService.validateMediaFullName('test user', englishLanguage, createMediaAccountLanguageFile)
            ).toBeNull();
        });

        it('should return error if name is not populated', () => {
            expect(
                createAccountService.validateMediaFullName('', englishLanguage, createMediaAccountLanguageFile)
            ).toEqual('There is a problem - Full name field must be populated');
        });

        it('should return error if name starts with a space', () => {
            expect(
                createAccountService.validateMediaFullName(
                    ' test user',
                    englishLanguage,
                    createMediaAccountLanguageFile
                )
            ).toEqual('There is a problem - Full name field must not start with a space');
        });

        it('should return error if name contains double space', () => {
            expect(
                createAccountService.validateMediaFullName(
                    'test  user',
                    englishLanguage,
                    createMediaAccountLanguageFile
                )
            ).toEqual('There is a problem - Full name field must not contain double spaces');
        });

        it('should return error if name does not contain at least 1 space', () => {
            expect(
                createAccountService.validateMediaFullName('testuser', englishLanguage, createMediaAccountLanguageFile)
            ).toEqual('There is a problem - Your full name will be needed to support your application for an account');
        });
    });

    describe('validateMediaEmailAddress', () => {
        it('should return null if no errors', () => {
            expect(
                createAccountService.validateMediaEmailAddress(
                    'test@email.com',
                    englishLanguage,
                    createMediaAccountLanguageFile
                )
            ).toBeNull();
        });

        it('should return error if email starts with a space', () => {
            expect(
                createAccountService.validateMediaEmailAddress(
                    ' test@email.com',
                    englishLanguage,
                    createMediaAccountLanguageFile
                )
            ).toEqual('There is a problem - Email address field cannot start with a space');
        });

        it('should return error if email contains double space', () => {
            expect(
                createAccountService.validateMediaEmailAddress(
                    'test@email.com  ',
                    englishLanguage,
                    createMediaAccountLanguageFile
                )
            ).toEqual('There is a problem - Email address field cannot contain double spaces');
        });
    });

    describe('validateMediaEmployer', () => {
        it('should return null if no errors', () => {
            expect(
                createAccountService.validateMediaEmployer(
                    'Test Employer',
                    englishLanguage,
                    createMediaAccountLanguageFile
                )
            ).toBeNull();
        });

        it('should return error if employer starts with a space', () => {
            expect(
                createAccountService.validateMediaEmployer(
                    ' Test Employer',
                    englishLanguage,
                    createMediaAccountLanguageFile
                )
            ).toEqual('There is a problem - Employer field cannot start with a space');
        });

        it('should return error if employer contains double space', () => {
            expect(
                createAccountService.validateMediaEmployer(
                    'Test  Employer',
                    englishLanguage,
                    createMediaAccountLanguageFile
                )
            ).toEqual('There is a problem - Employer field cannot contain double spaces');
        });
    });

    describe('validateFormFields', () => {
        it('should return valid response if all data is provided', () => {
            expect(
                createAccountService.validateFormFields(
                    validBody,
                    validImage,
                    englishLanguage,
                    createMediaAccountLanguageFile
                )
            ).toStrictEqual(responseNoErrors);
        });

        it('should return response with errors if invalid data and file', () => {
            expect(
                createAccountService.validateFormFields(
                    invalidBody,
                    invalidFileType,
                    englishLanguage,
                    createMediaAccountLanguageFile
                )
            ).toStrictEqual(responseErrors);
        });
    });

    describe('validateCsvFileContent', () => {
        const file = fs.readFileSync('./manualUpload/tmp/bulkMediaUploadValidationFile.csv', 'utf-8');

        it('should return no error if file content matches expected', async () => {
            const error = createAccountService.validateCsvFileContent(
                file,
                3,
                ['column1', 'column2', 'column3'],
                englishLanguage,
                bulkCreateMediaAccountsLanguageFile
            );
            expect(error).toBeNull();
        });

        it('should return no error if file header not in order', async () => {
            const error = createAccountService.validateCsvFileContent(
                file,
                3,
                ['column3', 'column1', 'column2'],
                englishLanguage,
                bulkCreateMediaAccountsLanguageFile
            );
            expect(error).toBeNull();
        });

        it('should return invalid file header error', async () => {
            const error = createAccountService.validateCsvFileContent(
                file,
                3,
                ['column1', 'column2', 'column4'],
                englishLanguage,
                bulkCreateMediaAccountsLanguageFile
            );
            expect(error).toStrictEqual('Invalid header in file');
        });

        it('should return incorrect field count error', async () => {
            const error = createAccountService.validateCsvFileContent(
                file,
                4,
                ['column1', 'column2', 'column3'],
                englishLanguage,
                bulkCreateMediaAccountsLanguageFile
            );
            expect(error).toStrictEqual('Incorrect number of fields in file');
        });

        it('should return too many accounts error', async () => {
            const file = fs.readFileSync('./manualUpload/tmp/bulkMediaUploadValidationFile_31Accounts.csv', 'utf-8');
            const error = createAccountService.validateCsvFileContent(
                file,
                3,
                ['column1', 'column2', 'column3'],
                englishLanguage,
                bulkCreateMediaAccountsLanguageFile
            );
            expect(error).toStrictEqual('Too many accounts, please upload a file with 30 accounts or less');
        });

        it('should return no error if maximum record count', async () => {
            const file = fs.readFileSync('./manualUpload/tmp/bulkMediaUploadValidationFile_30Accounts.csv', 'utf-8');
            const error = createAccountService.validateCsvFileContent(
                file,
                3,
                ['column1', 'column2', 'column3'],
                englishLanguage,
                bulkCreateMediaAccountsLanguageFile
            );
            expect(error).toBeNull();
        });
    });

    describe('createMediaAccount', () => {
        it('should return true if valid data is provided', async () => {
            createAzureAccountStub.withArgs(validMediaConvertedPayload, validEmail).resolves(azureResponse);
            createPIAccStub.resolves(true);
            const res = await createAccountService.createMediaAccount(validMediaPayload, validEmail);
            expect(res).toEqual(true);
        });

        it('check call to create media account contains VERIFIED role', async () => {
            createPIAccStub.resetHistory();
            createAzureAccountStub.withArgs(validMediaConvertedPayload, validEmail).resolves(azureResponse);
            createPIAccStub.resolves(true);
            await createAccountService.createMediaAccount(validMediaPayload, validEmail);
            sinon.assert.calledWithMatch(
                createPIAccStub,
                sinon.match((arg) =>
                    arg[0].roles === 'VERIFIED'
                ),
                validEmail
            );
        });

        it('should return false if create azure account request fails', async () => {
            createAzureAccountStub.withArgs(validMediaConvertedPayload, validEmail).resolves(null);
            expect(await createAccountService.createMediaAccount(validMediaPayload, validEmail)).toEqual(false);
        });

        it('should return false if create P&I account request fails', async () => {
            createAzureAccountStub.withArgs(validMediaConvertedPayload, validEmail).resolves(azureResponse);
            createPIAccStub.resolves(false);
            expect(await createAccountService.createMediaAccount(validMediaPayload, validEmail)).toEqual(false);
        });
    });

    describe('createMediaApplication', () => {
        it('should return true if valid data is provided', async () => {
            createMediaAccStub.resolves(true);
            const res = await createAccountService.createMediaApplication(validBody, validImage);
            expect(res).toEqual(true);
        });

        it('should return false if invalid data is provided', async () => {
            createMediaAccStub.resolves(false);
            const res = await createAccountService.createMediaApplication(invalidBody, validImage);
            expect(res).toEqual(false);
        });
    });

    describe('bulkCreateMediaAccounts', () => {
        it('should return true if valid data is provided', async () => {
            bulkCreateAccountsStub.resolves(true);
            const res = await createAccountService.bulkCreateMediaAccounts('validFile', 'fileName', '123-1bc');
            expect(res).toEqual(true);
        });

        it('should return false if invalid data is provided', async () => {
            bulkCreateAccountsStub.resolves(false);
            const res = await createAccountService.bulkCreateMediaAccounts('invalidFile', 'fileName', '123-1bc');
            expect(res).toEqual(false);
        });
    });
});
