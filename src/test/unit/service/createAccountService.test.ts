import { CreateAccountService } from '../../../main/service/createAccountService';
import sinon from 'sinon';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';
import { multerFile } from '../mocks/multerFile';

const createAccountService = new CreateAccountService();

const validImage = multerFile('testImage.png', 1000);
const invalidFileType = multerFile('testImage.wrong', 1000);

const validBody = {
  fullName: 'foo bar',
  emailAddress: 'bar@mail.com',
  employer: 'baz',
};
const invalidBody = {
  fullName: '',
  emailAddress: 'bar',
  employer: '',
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
    message:  'There is a problem - Full name field must be populated',
    href: '#fullName',
  },
  emailError: {
    message: 'There is a problem - Enter an email address in the correct format, like name@example.com',
    href: '#emailAddress',
  },
  employerError: {
    message: 'There is a problem - Your employers name will be needed to support your application for an account',
    href: '#employer',
  },
  fileUploadError: {
    message: 'There is a problem - ID evidence must be a JPG, PDF or PNG',
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

const validAdminPayload = {
  emailAddress: 'emailAddress',
  firstName: 'firstName',
  lastName: 'lastName',
  userRoleObject: { mapping: 'userRoleObject'},
};

const validAdminConvertedPayload = [{
  email: 'emailAddress',
  firstName: 'firstName',
  surname: 'lastName',
  role: 'userRoleObject',
}];

const validMediaPayload = {
  emailAddress: 'a@b.com',
  fullName: 'This is a full name',
};

const validMediaConvertedPayload = [{
  email: 'a@b.com',
  firstName: 'This is a full name',
  role: 'VERIFIED',
}];

const azureResponse = {'CREATED_ACCOUNTS': [
  {
    email: 'email',
    provenanceUserId: 'azureAccountId',
    roles: 'role',
  },
]};
const validEmail = 'joe@bloggs.com';
const createAzureAccountStub = sinon.stub(AccountManagementRequests.prototype, 'createAzureAccount');
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
      expect(createAccountService.validateEmail('joe.bloggs@mail'))
        .toBe('There is a problem - Enter an email address in the correct format, like name@example.com');
    });

    it('should return error message if email is not provided', () => {
      expect(createAccountService.validateEmail(''))
        .toBe('There is a problem - Email address field must be populated');
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
      expect(createAccountService.validateMediaFullName('test user')).toBeNull();
    });

    it('should return error if name is not populated', () => {
      expect(createAccountService.validateMediaFullName(''))
        .toEqual('There is a problem - Full name field must be populated');
    });

    it('should return error if name starts with a space', () => {
      expect(createAccountService.validateMediaFullName(' test user'))
        .toEqual('There is a problem - Full name field must not start with a space');
    });

    it('should return error if name contains double space', () => {
      expect(createAccountService.validateMediaFullName('test  user'))
        .toEqual('There is a problem - Full name field must not contain double spaces');
    });

    it('should return error if name does not contain at least 1 space', () => {
      expect(createAccountService.validateMediaFullName('testuser'))
        .toEqual('There is a problem - Your full name will be needed to support your application for an account');
    });
  });

  describe('validateMediaEmailAddress', () => {
    it('should return null if no errors', () => {
      expect(createAccountService.validateMediaEmailAddress('test@email.com')).toBeNull();
    });

    it('should return error if email starts with a space', () => {
      expect(createAccountService.validateMediaEmailAddress(' test@email.com'))
        .toEqual('There is a problem - Email address field cannot start with a space');
    });

    it('should return error if email contains double space', () => {
      expect(createAccountService.validateMediaEmailAddress('test@email.com  '))
        .toEqual('There is a problem - Email address field cannot contain double spaces');
    });
  });

  describe('validateMediaEmployer', () => {
    it('should return null if no errors', () => {
      expect(createAccountService.validateMediaEmployer('Test Employer')).toBeNull();
    });

    it('should return error if employer starts with a space', () => {
      expect(createAccountService.validateMediaEmployer(' Test Employer'))
        .toEqual('There is a problem - Employer field cannot start with a space');
    });

    it('should return error if employer contains double space', () => {
      expect(createAccountService.validateMediaEmployer('Test  Employer'))
        .toEqual('There is a problem - Employer field cannot contain double spaces');
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
      createAzureAccountStub.withArgs(validAdminConvertedPayload, validEmail).resolves(azureResponse);
      createPIAccStub.resolves(true);
      const res = await createAccountService.createAdminAccount(validAdminPayload, validEmail);
      expect(res).toEqual(true);
    });

    it('should return false if create azure account request fails', async () => {
      createAzureAccountStub.withArgs(validAdminConvertedPayload, validEmail).resolves(null);
      expect(await createAccountService.createAdminAccount(validAdminPayload, validEmail)).toEqual(false);
    });

    it('should return false if create P&I account request fails', async () => {
      createAzureAccountStub.withArgs(validAdminConvertedPayload, validEmail).resolves(azureResponse);
      createPIAccStub.resolves(false);
      expect(await createAccountService.createAdminAccount(validAdminPayload, validEmail)).toEqual(false);
    });
  });

  describe('createMediaAccount', () => {
    it('should return true if valid data is provided', async () => {
      createAzureAccountStub.withArgs(validMediaConvertedPayload, validEmail).resolves(azureResponse);
      createPIAccStub.resolves(true);
      const res = await createAccountService.createMediaAccount(validMediaPayload, validEmail);
      expect(res).toEqual(true);
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

});
