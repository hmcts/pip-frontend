import { CreateAccountService } from '../../../main/service/createAccountService';
import sinon from 'sinon';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';

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
const validAdminBody = {
  emailAddress: 'bar@mail.com',
  lastName: 'bar',
  firstName: 'foo',
  'user-role': 'admin-ctsc',
};
const invalidAdminBody = {
  emailAddress: '',
  firstName: '',
  lastName: '',
  'user-role': 'admin-ctsc',
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
  fileUploadError: {
    message: 'The selected file must be a JPG, PNG, TIF or PDF',
    href: '#file-upload',
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
  fileUploadError: {
    message: null,
    href: '#file-upload',
  },
};
const adminResponseNoErrors = {
  firstNameError: {
    message:  null,
    href: '#firstName',
  },
  emailError: {
    message: null,
    href: '#emailAddress',
  },
  lastNameError: {
    message: null,
    href: '#lastName',
  },
  radioError: {
    message: null,
    href: '#user-role',
  },
};
const adminResponseErrors = {
  firstNameError: {
    message: 'Enter first name',
    href: '#firstName',
  },
  emailError: {
    message: 'Enter email address',
    href: '#emailAddress',
  },
  lastNameError: {
    message: 'Enter last name',
    href: '#lastName',
  },
  radioError: {
    message: null,
    href: '#user-role',
  },
};
const validPayload = {
  emailAddress: 'emailAddress',
  firstName: 'firstName',
  surname: 'lastName',
  userRoleObject: { mapping: 'userRoleObject'},
};
const invalidPayload = {
  emailAddress: '',
  firstName: '',
  surname: '',
  userRoleObject: { mapping: 'userRoleObject'},
};
const validEmail = 'joe@bloggs.com';
const createAdminAccStub = sinon.stub(AccountManagementRequests.prototype, 'createAdminAccount');

describe('Create Account Service', () => {
  describe('isValidImageType', () => {
    it('should return true for valid image type', () => {
      expect(createAccountService.isValidImageType('foo.jpg')).toBe(true);
    });

    it('should return false for invalid image type', () => {
      expect(createAccountService.isValidImageType('bar.gif')).toBe(false);
    });
  });

  describe('validateImage', () => {
    it('should return null if valid image is provided', () => {
      expect(createAccountService.validateImage('foo.jpg')).toBe(null);
    });

    it('should return error message is image is not provided', () => {
      expect(createAccountService.validateImage('')).toBe('Select a file to upload');
    });

    it('should return error message is unsupported format image is provided', () => {
      expect(createAccountService.validateImage('bar.gif')).toBe('The selected file must be a JPG, PNG, TIF or PDF');
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

  describe('validateAdminFormFields', () => {
    it('should return valid response if all data is provided', () => {
      expect(createAccountService.validateAdminFormFields(validAdminBody)).toStrictEqual(adminResponseNoErrors);
    });

    it('should return response with errors if invalid data is provided', () => {
      expect(createAccountService.validateAdminFormFields(invalidAdminBody)).toStrictEqual(adminResponseErrors);
    });
  });

  describe('createAdminAccount', () => {
    it('should return true if valid data is provided', async () => {
      createAdminAccStub.resolves(true);
      const res = await createAccountService.createAdminAccount(validPayload, validEmail);
      expect(res).toEqual(true);
    });

    it('should return false if invalid data is provided', async () => {
      createAdminAccStub.resolves(false);
      expect(await createAccountService.createAdminAccount(invalidPayload, validEmail)).toEqual(false);
    });
  });
});
