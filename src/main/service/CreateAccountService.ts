import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';
import fs from 'fs';
import { FileHandlingService } from './FileHandlingService';
import { LanguageFileParser } from '../helpers/languageFileParser';

const languageFileParser = new LanguageFileParser();
const accountManagementRequests = new AccountManagementRequests();
const fileHandlingService = new FileHandlingService();

export class CreateAccountService {
    public validateFormFields(formValues: object, file: File, language: string, languageFile: string): object {
        return {
            nameError: {
                message: this.validateMediaFullName(formValues['fullName'], language, languageFile),
                href: '#fullName',
                value: formValues['fullName'],
            },
            emailError: {
                message: this.validateMediaEmailAddress(formValues['emailAddress'], language, languageFile),
                href: '#emailAddress',
                value: formValues['emailAddress'],
            },
            employerError: {
                message: this.validateMediaEmployer(formValues['employer'], language, languageFile),
                href: '#employer',
                value: formValues['employer'],
            },
            fileUploadError: {
                message: fileHandlingService.validateImage(file, language, languageFile),
                href: '#file-upload',
            },
            checkBoxError: {
                message: this.validateCheckbox(formValues['tcbox'], language, languageFile),
                href: '#tcbox',
                value: formValues['tcbox'] !== undefined,
            },
        };
    }

    isNotBlank(input): boolean {
        return !!input;
    }

    isDoubleSpaced(input): boolean {
        return input.indexOf('  ') !== -1;
    }

    isStartingWithSpace(input): boolean {
        return input.startsWith(' ');
    }

    isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._-]{0,40}@[a-zA-Z0-9.-]{0,40}\.[a-zA-Z]{2,5}$/;
        return emailRegex.test(email);
    }

    validateMediaFullName(input, language, languageFile): string {
        const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
        if (!this.isNotBlank(input)) {
            return languageFileParser.getText(fileJson, 'fullNameErrors', 'blank');
        } else if (this.isStartingWithSpace(input)) {
            return languageFileParser.getText(fileJson, 'fullNameErrors', 'whiteSpace');
        } else if (this.isDoubleSpaced(input)) {
            return languageFileParser.getText(fileJson, 'fullNameErrors', 'doubleWhiteSpace');
        } else if (input.split(' ').length - 1 < 1) {
            return languageFileParser.getText(fileJson, 'fullNameErrors', 'nameWithoutWhiteSpace');
        }
        return null;
    }

    validateMediaEmailAddress(input, language, languageFile): string {
        const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
        if (this.isStartingWithSpace(input)) {
            return languageFileParser.getText(fileJson, 'emailErrors', 'startWithWhiteSpace');
        } else if (this.isDoubleSpaced(input)) {
            return languageFileParser.getText(fileJson, 'emailErrors', 'doubleWhiteSpace');
        } else {
            return this.validateEmail(input, language, languageFile);
        }
    }

    validateMediaEmployer(input, language, languageFile): string {
        const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
        if (!this.isNotBlank(input)) {
            return languageFileParser.getText(fileJson, 'mediaEmployeeErrors', 'blank');
        } else if (this.isStartingWithSpace(input)) {
            return languageFileParser.getText(fileJson, 'mediaEmployeeErrors', 'whiteSpace');
        } else if (this.isDoubleSpaced(input)) {
            return languageFileParser.getText(fileJson, 'mediaEmployeeErrors', 'doubleWhiteSpace');
        }
        return null;
    }

    validateEmail(email: string, language: string, languageFile: string): string {
        let message = null;
        const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
        if (this.isNotBlank(email)) {
            if (!this.isValidEmail(email)) {
                message = languageFileParser.getText(fileJson, 'emailErrors', 'invalidEmailAddress');
            }
        } else {
            message = languageFileParser.getText(fileJson, 'emailErrors', 'blank');
        }
        return message;
    }

    validateCheckbox(input, language, languageFile): string {
        const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
        if (input) {
            return null;
        } else {
            return languageFileParser.getText(fileJson, null, 'ariaCheckboxError');
        }
    }

    validateCsvFileContent(file, expectedFieldCount, expectedHeader, language, languageFile): string {
        const rows = fileHandlingService.readCsvToArray(file);
        const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);

        if (rows.length > 0) {
            if (rows.length - 1 > 30) {
                return languageFileParser.getText(fileJson, 'fileUploadErrors', 'tooManyAccountsError');
            }

            const sortedFirstRow = [...rows[0]].sort((a, b) => a.localeCompare(b));
            if (JSON.stringify(sortedFirstRow) !== JSON.stringify(expectedHeader.sort())) {
                return languageFileParser.getText(fileJson, 'fileUploadErrors', 'headerError');
            }

            if (rows.some(row => row.length != expectedFieldCount)) {
                return languageFileParser.getText(fileJson, 'fileUploadErrors', 'fieldSizeError');
            }
        }
        return null;
    }

    formatCreateMediaAccountPayload(accountObject): any[] {
        return [
            {
                email: accountObject.emailAddress,
                firstName: accountObject.fullName,
                role: 'VERIFIED',
            },
        ];
    }

    formatCreateAccountPIPayload(azureAccount): any[] {
        return [
            {
                email: azureAccount.email,
                provenanceUserId: azureAccount.azureAccountId,
                roles: azureAccount.role,
                userProvenance: 'PI_AAD',
            },
        ];
    }

    formatCreateMediaAccount(accountObject, file): any {
        return {
            fullName: accountObject.fullName,
            email: accountObject.emailAddress,
            employer: accountObject.employer,
            status: 'PENDING',
            file: {
                body: fs.readFileSync(file.path),
                name: file.originalname,
            },
        };
    }

    public async createMediaAccount(payload: object, requester: string): Promise<boolean> {
        const azureResponse = await accountManagementRequests.createAzureAccount(
            this.formatCreateMediaAccountPayload(payload),
            requester
        );
        if (azureResponse?.['CREATED_ACCOUNTS'][0]) {
            const response = await accountManagementRequests.createPIAccount(
                this.formatCreateAccountPIPayload(azureResponse['CREATED_ACCOUNTS'][0]),
                requester
            );
            return response ? true : false;
        }
        return false;
    }

    public async createMediaApplication(payload: object, file: File): Promise<boolean> {
        return await accountManagementRequests.createMediaApplication(this.formatCreateMediaAccount(payload, file));
    }

    public async bulkCreateMediaAccounts(file: any, filename: string, id: string): Promise<boolean> {
        return await accountManagementRequests.bulkCreateMediaAccounts(file, filename, id);
    }
}
