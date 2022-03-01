import { CreateAccountService } from '../../../main/service/createAccountService';
import {multerFile} from '../mocks/multerFile';

const createAccountService = new CreateAccountService();
const validBody = {
  fullName: 'foo',
  emailAddress: 'bar@mail.com',
  employer: 'baz',
  'file-upload': 'blah.png',
};
const invalidBody = {
  fullName: '',
  emailAddress: 'bar',
  employer: 'baz',
  'file-upload': 'blah',
};
const responseErrors = {
  nameError: {
    message:  'Enter your full name',
    href: '#fullName',
  },
  emailError: {
    message: 'Enter an email address in the correct format, like name@example.com',
    href: '#emailAddress',
  },
  employerError: {
    message: null,
    href: '#employer',
  },
};

const responseNoErrors = {
  nameError: {
    message:  null,
    href: '#fullName',
  },
  emailError: {
    message: null,
    href: '#emailAddress',
  },
  employerError: {
    message: null,
    href: '#employer',
  },
};

const testFileValid = new File([''],'test.jpg',{type: 'image/jpeg'});
testFileValid['originalname'] = 'test.jpg';
const testFileInValid = new File([''], 'test.gif', {type: 'image/gif'});
testFileInValid['originalname'] = 'test.gif';
const largeFile = multerFile('testFile.pdf', 3000000);
const smallFile = multerFile('testFile.pdf', 1000000);

describe('Create Account Service', () => {
  describe('validateFileUpload', () => {
    it('should return null for valid image type', () => {
      expect(createAccountService.validateFileUpload(testFileValid)).toBe(null);
    });

    it('should return message for invalid image type', () => {
      expect(createAccountService.validateFileUpload(testFileInValid)).toBe('Please upload a valid file format');
    });

    it('should return message for invalid image type', () => {
      expect(createAccountService.validateFileUpload(largeFile)).toBe('File too large, please upload file smaller than 2MB');
    });
  });

  describe('isFileCorrectSize', () => {
    it('should return true for valid image type', () => {
      expect(createAccountService.isFileCorrectSize(smallFile.size)).toBe(true);
    });

    it('should return false for invalid image type', () => {
      expect(createAccountService.isFileCorrectSize(largeFile.size)).toBe(false);
    });
  });

  describe('isValidImageType', () => {
    it('should return true for valid image type', () => {
      expect(createAccountService.isValidImageType('jpg')).toBe(true);
    });

    it('should return false for invalid image type', () => {
      expect(createAccountService.isValidImageType('gif')).toBe(false);
    });
  });

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
      expect(createAccountService.validateEmail('joe.bloggs@hotmail.com')).toBe(null);
    });

    it('should return error message if invalid email is provided', () => {
      expect(createAccountService.validateEmail('joe.bloggs@mail')).toBe('Enter an email address in the correct format, like name@example.com');
    });

    it('should return error message if email is not provided', () => {
      expect(createAccountService.validateEmail('')).toBe('Enter your email address');
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

  describe('validateFormFields', () => {
    it('should return valid response if all data is provided', () => {
      expect(createAccountService.validateFormFields(validBody)).toStrictEqual(responseNoErrors);
    });

    it('should return response with errors if invalid data is provided', () => {
      expect(createAccountService.validateFormFields(invalidBody)).toStrictEqual(responseErrors);
    });
  });
});
