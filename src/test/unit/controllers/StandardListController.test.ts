import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';
import sinon from 'sinon';
import StandardListController from '../../../main/controllers/StandardListController';
import {CourtService} from '../../../main/service/courtService';

const standardListController = new StandardListController();
const i18n = {};
sinon.stub(CourtService.prototype, 'getCourtById').resolves([]);

describe('Standard list controller', () => {
  it('should render the standard list page', async () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {locationId: '10'};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['standard-list'],
      court: [],
    };

    responseMock.expects('render').once().withArgs('standard-list', expectedData);

    await standardListController.get(request, response);
    responseMock.verify();
  });
});
