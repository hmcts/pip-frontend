import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import CookiesPageController from '../../../main/controllers/CookiesPageController';

const cookiesPageController = new CookiesPageController();

describe('Cookies Page controller', () => {
  it('should render cookies page', async () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest({'cookie-policy': {}});
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('cookies', request.i18n.getDataByLanguage(request.lng)['cookies']);
    await cookiesPageController.get(request, response);
    await responseMock.verify();
  });
});
