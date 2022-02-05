import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import InterstitialController from '../../../main/controllers/InterstitialController';
import sinon from 'sinon';

const i18n = {interstitial: {} };
const interstitialController = new InterstitialController();

describe('Interstitial Controller', () => {
  it('should render a page', async () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);
    request['cookies'] = {'i18next': 'en'};
    const expectedOptions = {
      ...i18n.interstitial,
      currentLanguage: 'en',
    };

    responseMock.expects('render').once().withArgs('interstitial', expectedOptions);

    await interstitialController.get(request, response);
    responseMock.verify();
  });

  it('should render a page with English language query param', async () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);
    request['cookies'] = {'i18next': 'en'};
    request.query = {lng: 'en'};
    const expectedOptions = {
      ...i18n.interstitial,
      currentLanguage: 'en',
    };

    responseMock.expects('render').once().withArgs('interstitial', expectedOptions);

    await interstitialController.get(request, response);
    responseMock.verify();
  });

  it('should render a page with Welsh language query param', async () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);
    request['cookies'] = {'i18next': 'cy'};
    request.query = {lng: 'cy'};
    const expectedOptions = {
      ...i18n.interstitial,
      currentLanguage: 'cy',
    };

    responseMock.expects('render').once().withArgs('interstitial', expectedOptions);

    await interstitialController.get(request, response);
    responseMock.verify();
  });
});
