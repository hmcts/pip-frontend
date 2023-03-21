import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';
import fs from 'fs';
import { FileHandlingService } from './fileHandlingService';
import { LanguageFileParser } from '../helpers/languageFileParser';

const languageFileParser = new LanguageFileParser();
const adminRolesList = [
    {
        key: 'super-admin-ctsc',
        text: 'Internal - Super Administrator - CTSC',
        mapping: 'INTERNAL_SUPER_ADMIN_CTSC',
        hint: 'Upload, Remove, Create new accounts, Assess new media requests, User management',
    },
    {
        key: 'super-admin-local',
        text: 'Internal - Super Administrator - Local',
        mapping: 'INTERNAL_SUPER_ADMIN_LOCAL',
        hint: 'Upload, Remove, Create new account, User management',
    },
    {
        key: 'admin-ctsc',
        text: 'Internal - Administrator - CTSC',
        mapping: 'INTERNAL_ADMIN_CTSC',
        hint: 'Upload, Remove, Assess new media request',
    },
    {
        key: 'admin-local',
        text: 'Internal - Administrator - Local',
        mapping: 'INTERNAL_ADMIN_LOCAL',
        hint: 'Upload, Remove',
    },
];
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

    /**
     * This validates the form fields when submitting an admin request, but without a role.
     * @param formValues The values to validate.
     * @param language The language to use.
     * @param languageFile The language file to use.
     */
    public validateAdminFormFields(formValues: object, language: string, languageFile: string): object {
        const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
        return {
            firstNameError: {
                message: this.isNotBlank(formValues['firstName'])
                    ? null
                    : languageFileParser.getText(fileJson, null, 'firstnameError'),
                href: '#firstName',
            },
            lastNameError: {
                message: this.isNotBlank(formValues['lastName'])
                    ? null
                    : languageFileParser.getText(fileJson, null, 'surnameError'),
                href: '#lastName',
            },
            emailError: {
                message: this.validateEmail(formValues['emailAddress'], language, languageFile),
                href: '#emailAddress',
            },
        };
    }

    /**
     * This validates the form fields including the role.
     * @param formValues The values to validate.
     * @param language The language to use.
     * @param languageFile The language file to use.
     */
    public validateAdminFormFieldsWithRole(formValues: object, language: string, languageFile: string): object {
        const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
        const stateReturn = this.validateAdminFormFields(formValues, language, languageFile);

        stateReturn['radioError'] = {
            message: formValues['user-role'] ? null : languageFileParser.getText(fileJson, null, 'roleError'),
            href: '#user-role',
        };

        return stateReturn;
    }

    public getRoleByKey(key: string): object {
        return adminRolesList.find(item => item.key === key);
    }

    public buildRadiosList(checkedRadio = ''): any[] {
        const radios = [];
        adminRolesList.forEach(role => {
            radios.push({
                value: role.key,
                text: role.text,
                checked: checkedRadio === role.key,
                hint: {
                    text: role.hint,
                },
            });
        });
        return radios;
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

            const sortedFirstRow = rows[0].sort();
            if (JSON.stringify(sortedFirstRow) !== JSON.stringify(expectedHeader.sort())) {
                return languageFileParser.getText(fileJson, 'fileUploadErrors', 'headerError');
            }

            if (rows.some(row => row.length != expectedFieldCount)) {
                return languageFileParser.getText(fileJson, 'fileUploadErrors', 'fieldSizeError');
            }
        }
        return null;
    }

    formatCreateAdminAccountPayload(accountObject): any[] {
        return [
            {
                email: accountObject.emailAddress,
                firstName: accountObject.firstName,
                surname: accountObject.lastName,
                role: accountObject.userRoleObject.mapping,
            },
        ];
    }

    formatCreateSystemAdminAccountPayload(accountObject): any {
        return {
            email: accountObject.emailAddress,
            firstName: accountObject.firstName,
            surname: accountObject.lastName,
        };
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

    public async createAdminAccount(payload: object, requester: string): Promise<boolean> {
        const azureResponse = await accountManagementRequests.createAzureAccount(
            this.formatCreateAdminAccountPayload(payload),
            requester
        );
        if (azureResponse?.['CREATED_ACCOUNTS'][0]) {
            return await accountManagementRequests.createPIAccount(
                this.formatCreateAccountPIPayload(azureResponse['CREATED_ACCOUNTS'][0]),
                requester
            );
        }
        return false;
    }

    /**
     * This method takes in a system admin account request, formats it and passes it onto the request service to create.
     * @param payload The system admin account to create.
     * @param requester The ID of the system admin who requested the account.
     */
    public async createSystemAdminAccount(payload: object, requester: string): Promise<any> {
        const creationResponse = accountManagementRequests.createSystemAdminUser(
            this.formatCreateSystemAdminAccountPayload(payload),
            requester
        );
        if (creationResponse) {
            return creationResponse;
        }
        return null;
    }

    public async createMediaAccount(payload: object, requester: string): Promise<boolean> {
        const azureResponse = await accountManagementRequests.createAzureAccount(
            this.formatCreateMediaAccountPayload(payload),
            requester
        );
        if (azureResponse?.['CREATED_ACCOUNTS'][0]) {
            return await accountManagementRequests.createPIAccount(
                this.formatCreateAccountPIPayload(azureResponse['CREATED_ACCOUNTS'][0]),
                requester
            );
        }
        return false;
    }

    public async createMediaApplication(payload: object, file: File): Promise<boolean> {
        return await accountManagementRequests.createMediaAccount(this.formatCreateMediaAccount(payload, file));
    }

    public async bulkCreateMediaAccounts(file: any, filename: string, id: string): Promise<boolean> {
        return await accountManagementRequests.bulkCreateMediaAccounts(file, filename, id);
    }
}
