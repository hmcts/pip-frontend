import { allowedImageTypes } from '../models/consts';
import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';

const adminRolesList = [
  {
    key: 'super-admin-ctsc',
    text: 'Internal - Super Administrator - CTSC',
    mapping: 'INTERNAL_SUPER_ADMIN_CTSC',
  },
  {
    key: 'super-admin-local',
    text: 'Internal - Super Administrator - Local',
    mapping: 'INTERNAL_SUPER_ADMIN_LOCAL',
  },
  {
    key: 'admin-ctsc',
    text: 'Internal - Administrator - CTSC',
    mapping: 'INTERNAL_ADMIN_CTSC',
  },
  {
    key: 'admin-local',
    text: 'Internal - Administrator - Local',
    mapping: 'INTERNAL_ADMIN_LOCAL',
  },
];
const accountManagementRequests = new AccountManagementRequests();

export class CreateAccountService {
  public validateFormFields(formValues: object): object {
    return {
      nameError: {
        message: this.isNotBlank(formValues['fullName']) ? null : 'Enter your full name',
        href: '#fullName',
      },
      emailError: {
        message: this.validateEmail(formValues['emailAddress']),
        href: '#emailAddress',
      },
      employerError: {
        message: this.isNotBlank(formValues['employer']) ? null : 'Enter your employer',
        href: '#employer',
      },
      fileUploadError: {
        message:this.validateImage(formValues['file-upload']),
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
      });
    });
    return radios;
  }

  isValidImageType(imageName: string): boolean {
    const imageType = imageName.split('.')[1]?.toLocaleLowerCase();
    return allowedImageTypes.includes(imageType);
  }

  isNotBlank(input): boolean {
    return !!(input);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]{0,40}@[a-zA-Z0-9.-]{0,40}\.[a-zA-Z]{2,5}$/;
    return emailRegex.test(email);
  }

  validateEmail(email: string, isAdmin = false): string {
    let message = null;
    if (this.isNotBlank(email)) {
      if (!this.isValidEmail(email)) {
        message = 'Enter an email address in the correct format, like name@example.com';
      }
    } else {
      message = isAdmin ? 'Enter email address' : 'Enter your email address';
    }
    return message;
  }

  validateImage(image: string): string {
    let message = null;
    if (this.isNotBlank(image)) {
      if(!this.isValidImageType(image)) {
        message = 'The selected file must be a JPG, PNG, TIF or PDF';
      }
    } else {
      message = 'Select a file to upload';
    }
    return message;
  }

  formatCreateAdminAccountPayload(accountObject): object {
    return {
      email: accountObject.emailAddress,
      firstName: accountObject.firstName,
      surname: accountObject.lastName,
      role: accountObject.userRoleObject.mapping,
    };
  }

  public async createAdminAccount(payload: object, requester: string): Promise<boolean> {
    return await accountManagementRequests.createAdminAccount(this.formatCreateAdminAccountPayload(payload), requester);
  }
}
