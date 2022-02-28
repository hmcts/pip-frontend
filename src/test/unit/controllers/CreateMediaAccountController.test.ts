import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import CreateMediaAccountController from '../../../main/controllers/CreateMediaAccountController';
import { CreateAccountService } from '../../../main/service/createAccountService';
import {ManualUploadService} from '../../../main/service/manualUploadService';

const createMediaAccountController = new CreateMediaAccountController();
const validBody = {
  fullName: 'foo',
  emailAddress: 'bar@foobar.com',
  employer: 'baz',
  'file-upload': 'blah.png',
};
const invalidBody = {
  fullName: '',
  emailAddress: 'bar',
  employer: 'baz',
  'file-upload': 'blah.png',
};
const responseErrors = {
  nameError: {
    message:  'error',
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

const errors = {
  fileErrors: 'error',
  formErrors: responseErrors,
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
const formStub = sinon.stub(CreateAccountService.prototype, 'validateFormFields');
const testFile = new File([''], 'test', {type: 'text/html'});
const fileValidationStub = sinon.stub(CreateAccountService.prototype, 'validateFileUpload');

formStub.withArgs(validBody).returns(responseNoErrors);
formStub.withArgs(invalidBody).returns(responseErrors);
fileValidationStub.returns('error');
fileValidationStub.withArgs(testFile).returns();

describe('Create Media Account Controller', () => {
  const i18n = {'create-media-account': {}};
  let response = { render: () => {return '';}} as unknown as Response;
  const request = mockRequest(i18n);
  request.cookies['formCookie'] = '{"fullName":"foo","emailAddress":"foo@foobar.com","employer":"MoJ", "file-upload": "blah.png"}';
  const formData = JSON.parse(request.cookies['formCookie']);
  const expectedData = {
    ...i18n['create-media-account'],
    formData: formData,
  };

  describe('get request', () => {
    it('should render create media account page', async () => {
      const responseMock = sinon.mock(response);
      responseMock.expects('render').once().withArgs('create-media-account', expectedData);

      await createMediaAccountController.get(request, response);
      responseMock.verify();
    });
  });

  describe('post requests', () => {
    it('should render create media account page', async () => {
      request.body = invalidBody;
      const referenceStub = sinon.stub(CreateAccountService.prototype, 'uploadCreateAccount');
      referenceStub.withArgs(validBody).returns('ABCD1234');
      response = { render: () => {return '';},
        cookie: () => {return invalidBody;}} as unknown as Response;
      const responseMock = sinon.mock(response);

      const expectedOptions = {
        ...i18n['create-media-account'],
        errors: errors,
        formData: invalidBody,
      };

      responseMock.expects('render').once().withArgs('create-media-account', expectedOptions);

      await createMediaAccountController.post(request, response);
      responseMock.verify();
    });

    it('should redirect to confirmation page', async () => {
      sinon.restore();
      sinon.stub(ManualUploadService.prototype, 'readFile').returns('');
      sinon.stub(ManualUploadService.prototype, 'removeFile').returns('');
      sinon.stub(CreateAccountService.prototype, 'isValidImageType').returns(true);
      sinon.stub(CreateAccountService.prototype, 'isFileCorrectSize').returns(true);
      const referenceStub = sinon.stub(CreateAccountService.prototype, 'uploadCreateAccount');
      referenceStub.withArgs(validBody).returns('ABCD1234');
      fileValidationStub.withArgs(testFile).returns();

      response = { redirect: () => {return '';},
        clearCookie: () => {return '';}} as unknown as Response;
      const responseMock = sinon.mock(response);
      request.body = validBody;

      responseMock.expects('redirect').once().withArgs('/account-request-submitted?reference=ABCD1234');

      await createMediaAccountController.post(request, response);
      responseMock.verify();
    });
  });
});
