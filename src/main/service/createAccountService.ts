import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import { allowedImageTypes } from '../models/consts';
import {ManualUploadService} from './manualUploadService';
import { Application } from 'models/Application';

const manualUploadService = new ManualUploadService();
const accountManagementRequests = new AccountManagementRequests();

export class CreateAccountService {

  public async uploadCreateAccount(data: any): Promise<Application> {
    return await accountManagementRequests.uploadNewAccountRequest(
      data,
      this.generatePublicationUploadHeaders(data),
    );
  }

  public generatePublicationUploadHeaders(headers): object {
    return {
      'x-provenance': 'CREATE_ACCOUNT',
      'x-source-file-name': headers.fileName,
      'x-full-name': headers['fullName'],
      'x-email-address': headers['emailAddress'],
      'x-employer': headers['employer'],
      'Content-Type': 'multipart/form-data',
    };
  }

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
    };
  }

  public formatReference(reference: number, length = 5, paddingString = '0'): string {
    return reference > 0 ? 'XYZ' + reference.toString().padStart(length, paddingString) : null;
  }

  public validateFileUpload(file: File): string {
    if (file) {
      if (this.isValidImageType(manualUploadService.getFileExtension(file['originalname']))) {
        if (manualUploadService.isFileCorrectSize(file.size)) {
          return null;
        }
        return 'File too large, please upload file smaller than 2MB';
      }
      return 'Please upload a valid file format';
    }
    return 'Select a file to upload';
  }

  isValidImageType(imageName: string): boolean {
    if (imageName) {
      return allowedImageTypes.includes(imageName);
    } else {
      return false;
    }
  }

  isNotBlank(input): boolean {
    return !!(input);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]{0,40}@[a-zA-Z0-9.-]{0,40}\.[a-zA-Z]{2,5}$/;
    return emailRegex.test(email);
  }

  validateEmail(email: string): string {
    let message = null;
    if (this.isNotBlank(email)) {
      if (!this.isValidEmail(email)) {
        message = 'Enter an email address in the correct format, like name@example.com';
      }
    } else {
      message = 'Enter your email address';
    }
    return message;
  }

}
