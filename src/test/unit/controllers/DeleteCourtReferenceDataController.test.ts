import { Response } from 'express';
import { LocationService } from '../../../main/service/locationService';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import DeleteCourtReferenceDataController from '../../../main/controllers/DeleteCourtReferenceDataController';

const deleteCourtReferenceDataController = new DeleteCourtReferenceDataController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtList = JSON.parse(rawData);
sinon.stub(LocationService.prototype, 'fetchAllLocations').returns(courtList);

const i18n = {'delete-court-reference-data': {}};

describe('Delete Court Reference Data Controller', () => {
  it('should render the court reference data list page', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);
    const expectedData = {
      ...i18n['delete-court-reference-data'],
      courtList: courtList,
    };

    responseMock.expects('render').once().withArgs('delete-court-reference-data', expectedData);
    return deleteCourtReferenceDataController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
});
