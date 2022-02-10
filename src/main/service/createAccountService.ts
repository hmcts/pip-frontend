import { allowedImageTypes } from '../models/consts';

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
}
