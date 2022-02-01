import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import SignInController from '../../../main/controllers/SignInController';
import { getFlowName } from '../../../main/authentication/authRedirect';

const signInController = new SignInController();
const HMCTSAccountUrl = 'https://hmcts-sjp.herokuapp.com/sign-in-idam.html';
const piUrl = `/login?p=${getFlowName(process.env.ENV)}`;

describe('Sign In Option Controller', () => {
  const i18n = {'sign-in': {}};

  it('should render Sign in page', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);
    const options = {
      ...i18n['sign-in'],
      displayError: false,
    };

    responseMock.expects('render').once().withArgs('sign-in', options);
    signInController.get(request, response);
    responseMock.verify();
  });

  it('should render Sign in page with error state', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);
    request.query = {error: 'true'};
    const options = {
      ...i18n['sign-in'],
      displayError: true,
    };

    responseMock.expects('render').once().withArgs('sign-in', options);
    signInController.get(request, response);
    responseMock.verify();
  });

  it('should render Sign In page if choice is \'hmcts\'', () => {
    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'sign-in': 'hmcts'};
    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs(HMCTSAccountUrl);
    signInController.post(request, response);
    responseMock.verify();
  });

  it('should render Sign In page if choice is \'common\'', () => {
    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'sign-in': 'common'};
    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs(HMCTSAccountUrl);
    signInController.post(request, response);
    responseMock.verify();
  });

  it('should render Sign In page if choice is \'pi\'', () => {
    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'sign-in': 'pi'};
    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs(piUrl);
    signInController.post(request, response);
    responseMock.verify();
  });

  it('should redirect to the Sign In page if choice is empty', () => {
    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'sign-in': ''};
    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('/sign-in?error=true');
    signInController.post(request, response);
    responseMock.verify();
  });
});
