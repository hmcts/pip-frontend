import OldListOptionController from '../../../main/controllers/OldListOptionController';
import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import {CourtService} from '../../../main/service/courtService';

const listOptionController = new OldListOptionController();
const i18n = {
  'list-option': {},
};

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData)[0];
sinon.stub(CourtService.prototype, 'getCourtById').resolves(courtData);

describe('Get List option', () => {
  it('should render the old list option page', () => {

    const response = {
      render: function() {return '';},
    } as unknown as Response;

    const request = mockRequest(i18n);
    request.query = {courtId: '1'};
    request.user = {id: 1};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['list-option'],
      court: courtData,
    };

    responseMock.expects('render').once().withArgs('list-option', expectedData);

    return listOptionController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should redirect to the hearing list page', () => {
    const response = {
      redirect: function() {return '';},
    } as unknown as Response;

    const request = mockRequest(i18n);
    request.query = {courtId: '1'};
    request.user = undefined;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('hearing-list?courtId=1');

    return listOptionController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
});
