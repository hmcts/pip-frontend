import { CreateAccountService } from '../../../main/service/createAccountService';
import sinon from 'sinon';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';
import { multerFile } from '../mocks/multerFile';

const createAccountService = new CreateAccountService();

const validImage = multerFile('testImage.png', 1000);
const invalidFileType = multerFile('testImage.wrong', 1000);

const validBody = {
  fullName: 'foo',
  emailAddress: 'bar@mail.com',
  employer: 'baz',
};
const invalidBody = {
  fullName: '',
  emailAddress: 'bar',
  employer: 'baz',
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
const azureResponse = {'CREATED_ACCOUNTS': [
  {
    email: 'email',
    provenanceUserId: 'azureAccountId',
    roles: 'role',
  },
]};
const validEmail = 'joe@bloggs.com';
const createAdminAccStub = sinon.stub(AccountManagementRequests.prototype, 'createAzureAccount');
const createPIAccStub = sinon.stub(AccountManagementRequests.prototype, 'createPIAccount');
const createMediaAccStub = sinon.stub(AccountManagementRequests.prototype, 'createMediaAccount');

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
      expect(createAccountService.validateFormFields(validBody, validImage)).toStrictEqual(responseNoErrors);
    });

    it('should return response with errors if invalid data and file', () => {
      expect(createAccountService.validateFormFields(invalidBody, invalidFileType)).toStrictEqual(responseErrors);
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
      createAdminAccStub.resolves(azureResponse);
      createPIAccStub.resolves(true);
      const res = await createAccountService.createAdminAccount(validPayload, validEmail);
      expect(res).toEqual(true);
    });

    it('should return false if create azure account request fails', async () => {
      createAdminAccStub.resolves(null);
      expect(await createAccountService.createAdminAccount(invalidPayload, validEmail)).toEqual(false);
    });

    it('should return false if create P&I account request fails', async () => {
      createAdminAccStub.resolves(azureResponse);
      createPIAccStub.resolves(false);
      expect(await createAccountService.createAdminAccount(invalidPayload, validEmail)).toEqual(false);
    });
  });

  describe('createMediaAccount', () => {
    it('should return true if valid data is provided', async () => {
      createMediaAccStub.resolves(true);
      const res = await createAccountService.createMediaAccount(validBody, validImage);
      expect(res).toEqual(true);
    });

    it('should return false if invalid data is provided', async () => {
      createMediaAccStub.resolves(false);
      const res = await createAccountService.createMediaAccount(invalidBody, validImage);
      expect(res).toEqual(false);
    });
  });
});
