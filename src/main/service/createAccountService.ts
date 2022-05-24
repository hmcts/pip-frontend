import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';
import fs from 'fs';
import { FileHandlingService } from './fileHandlingService';

const adminRolesList = [
  {
    key: 'super-admin-ctsc',
    text: 'Internal - Super Administrator - CTSC',
    mapping: 'INTERNAL_SUPER_ADMIN_CTSC',
    hint: 'Upload, Remove, Create new accounts, Assess new media requests',
  },
  {
    key: 'super-admin-local',
    text: 'Internal - Super Administrator - Local',
    mapping: 'INTERNAL_SUPER_ADMIN_LOCAL',
    hint: 'Upload, Remove, Create new account',
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
  public validateFormFields(formValues: object, file: File): object {
    return {
      nameError: {
        message: this.validateMediaFullName(formValues['fullName']),
        href: '#fullName',
      },
      emailError: {
        message: this.validateMediaEmailAddress(formValues['emailAddress']),
        href: '#emailAddress',
      },
      employerError: {
        message: this.validateMediaEmployer(formValues['employer']),
        href: '#employer',
      },
      fileUploadError: {
        message: fileHandlingService.validateImage(file),
        href: '#file-upload',
      },
    };
  }

  public validateAdminFormFields(formValues: object): object {
    return {
      firstNameError: {
        message: this.isNotBlank(formValues['firstName']) ? null : 'Enter first name',
        href: '#firstName',
      },
      lastNameError: {
        message: this.isNotBlank(formValues['lastName']) ? null : 'Enter last name',
        href: '#lastName',
      },
      emailError: {
        message: this.validateEmail(formValues['emailAddress'], true),
        href: '#emailAddress',
      },
      radioError: {
        message: formValues['user-role'] ? null : 'Select a role',
        href: '#user-role',
      },
    };
  }

  public getRoleByKey(key: string): object {
    return adminRolesList.find(item => item.key === key);
  }

  public buildRadiosList(checkedRadio = ''): any[] {
    const radios = [];
    adminRolesList.forEach((role) => {
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
    return !!(input);
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

  validateMediaFullName(input): string {
    if(!this.isNotBlank(input)) {
      return 'There is a problem - Full name field must be populated';
    } else if(this.isStartingWithSpace(input)) {
      return 'There is a problem - Full name field must not start with a space';
    } else if(this.isDoubleSpaced(input)) {
      return 'There is a problem - Full name field must not contain double spaces';
    } else if((input.split(' ').length - 1) < 1) {
      return 'There is a problem - Your full name will be needed to support your application for an account';
    }
    return null;
  }

  validateMediaEmailAddress(input): string {
    if(this.isStartingWithSpace(input)) {
      return 'There is a problem - Email address field cannot start with a space';
    } else if(this.isDoubleSpaced(input)) {
      return 'There is a problem - Email address field cannot contain double spaces';
    } else {
      return this.validateEmail(input);
    }
  }

  validateMediaEmployer(input): string {
    if(!this.isNotBlank(input)) {
      return 'There is a problem - Your employers name will be needed to support your application for an account';
    } else if(this.isStartingWithSpace(input)) {
      return 'There is a problem - Employer field cannot start with a space';
    } else if(this.isDoubleSpaced(input)) {
      return 'There is a problem - Employer field cannot contain double spaces';
    }
    return null;
  }

  validateEmail(email: string, isAdmin = false): string {
    let message = null;
    if (this.isNotBlank(email)) {
      if (!this.isValidEmail(email)) {
        message = 'There is a problem - Enter an email address in the correct format, like name@example.com';
      }
    } else {
      message = isAdmin ? 'Enter email address' : 'There is a problem - Email address field must be populated';
    }
    return message;
  }

  formatCreateAdminAccountPayload(accountObject): any[] {
    return [{
      email: accountObject.emailAddress,
      firstName: accountObject.firstName,
      surname: accountObject.lastName,
      role: accountObject.userRoleObject.mapping,
    }];
  }

  formatCreateMediaAccountPayload(accountObject): any[] {
    return [{
      email: accountObject.emailAddress,
      firstName: accountObject.fullName,
      role: 'VERIFIED',
    }];
  }

  formatCreateAccountPIPayload(azureAccount): any[] {
    return [{
      email: azureAccount.email,
      provenanceUserId: azureAccount.azureAccountId,
      roles: azureAccount.role,
      userProvenance: 'PI_AAD',
    }];
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
      this.formatCreateAdminAccountPayload(payload), requester);
    if (azureResponse?.['CREATED_ACCOUNTS'][0]) {
      return await accountManagementRequests.createPIAccount(
        this.formatCreateAccountPIPayload(azureResponse['CREATED_ACCOUNTS'][0]), requester);
    }
    return false;
  }

  public async createMediaAccount(payload: object, requester: string): Promise<boolean> {
    const azureResponse = await accountManagementRequests.createAzureAccount(
      this.formatCreateMediaAccountPayload(payload), requester);
    if (azureResponse?.['CREATED_ACCOUNTS'][0]) {
      return await accountManagementRequests.createPIAccount(
        this.formatCreateAccountPIPayload(azureResponse['CREATED_ACCOUNTS'][0]), requester);
    }
    return false;
  }

  public async createMediaApplication(payload: object, file: File): Promise<boolean> {
    return await accountManagementRequests.createMediaAccount(this.formatCreateMediaAccount(payload, file));
  }
}
