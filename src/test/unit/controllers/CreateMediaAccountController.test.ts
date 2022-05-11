import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import CreateMediaAccountController from '../../../main/controllers/CreateMediaAccountController';
import { CreateAccountService } from '../../../main/service/createAccountService';
import { multerFile } from '../mocks/multerFile';

const createMediaAccountController = new CreateMediaAccountController();
const validBody = {
  fullName: 'foo',
  emailAddress: 'bar',
  employer: 'baz',
};
const invalidBody = {
  fullName: '',
  emailAddress: 'bar',
  employer: 'baz',
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
  fileUploadError: {
    message: null,
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

const invalidFileType = multerFile('testImage.wrong', 1000);

const formStub = sinon.stub(CreateAccountService.prototype, 'validateFormFields');
formStub.withArgs(validBody).returns(responseNoErrors);
formStub.withArgs(invalidBody, invalidFileType).returns(responseErrors);

describe('Create Media Account Controller', () => {
  const i18n = {'create-media-account': {}};
  const response = { render: () => {return '';}} as unknown as Response;
  const request = mockRequest(i18n);

  describe('get request', () => {
    it('should render create media account page', async () => {
      const responseMock = sinon.mock(response);
      responseMock.expects('render').once().withArgs('create-media-account', request.i18n.getDataByLanguage(request.lng)['create-media-account']);

      await createMediaAccountController.get(request, response);
      responseMock.verify();
    });
  });

  describe('post requests', () => {
    it('should render create media account page', async () => {
      request.body = invalidBody;
      request.file = invalidFileType;
      const responseMock = sinon.mock(response);
      const expectedOptions = {
        ...i18n['create-media-account'],
        formErrors: responseErrors,
      };

      responseMock.expects('render').once().withArgs('create-media-account', expectedOptions);

      await createMediaAccountController.post(request, response);
      responseMock.verify();
    });

    it('should render same page if errors are present', async () => {
      const response = { render: () => {return '';}} as unknown as Response;
      const responseMock = sinon.mock(response);
      request.body = invalidBody;
      request.file = invalidFileType;

      responseMock.expects('render').once().withArgs('create-media-account');
    });
  });
});
