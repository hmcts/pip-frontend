import { Response } from 'express';
import { LocationService } from '../../../main/service/locationService';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import DeleteCourtReferenceDataController from '../../../main/controllers/DeleteCourtReferenceDataController';

const courtStub = sinon.stub(LocationService.prototype, 'getLocationByName');
const deleteCourtReferenceDataController = new DeleteCourtReferenceDataController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtList = JSON.parse(rawData);
const court = {locationId: 1};
sinon.stub(LocationService.prototype, 'fetchAllLocations').returns(courtList);
courtStub.withArgs('aa').resolves(null);
courtStub.withArgs('test').resolves(null);
courtStub.withArgs('Mut').resolves(null);
courtStub.withArgs('Valid Location').resolves(court);

const i18n = {'delete-court-reference-data': {}};

describe('Delete Court Search Controller', () => {
  it('should render the court list search page', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);
    const expectedData = {
      ...i18n['delete-court-reference-data'],
      autocompleteList: courtList,
      invalidInputError: false,
      noResultsError: false,
    };

    responseMock.expects('render').once().withArgs('delete-court-reference-data', expectedData);
    return deleteCourtReferenceDataController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render delete court list search page if input is less than three characters long', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = {'input-autocomplete': 'aa'};
    const responseMock = sinon.mock(response);
    const expectedData = {
      ...i18n['delete-court-reference-data'],
      autocompleteList: courtList,
      invalidInputError: true,
      noResultsError: false,
    };

    responseMock.expects('render').once().withArgs('delete-court-reference-data', expectedData);
    return deleteCourtReferenceDataController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render delete court search page if there are no matching results', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = {'input-autocomplete': 'test'};
    const responseMock = sinon.mock(response);
    const expectedData = {
      ...i18n['delete-court-reference-data'],
      autocompleteList: courtList,
      invalidInputError: false,
      noResultsError: true,
    };

    responseMock.expects('render').once().withArgs('delete-court-reference-data', expectedData);
    return deleteCourtReferenceDataController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render delete court list search page if input is three characters long and partially correct as noResultsError', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = {'input-autocomplete': 'Mut'};
    const responseMock = sinon.mock(response);
    const expectedData = {
      ...i18n['delete-court-reference-data'],
      autocompleteList: courtList,
      invalidInputError: false,
      noResultsError: true,
    };

    responseMock.expects('render').once().withArgs('delete-court-reference-data', expectedData);
    return deleteCourtReferenceDataController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should redirect to delete court confirmation page with input as query if court name input is valid', () => {
    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = {'input-autocomplete': 'Valid Location'};
    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('delete-court-reference-data-confirmation?locationId=1');
    return deleteCourtReferenceDataController.post(request, response).then(() => {
      responseMock.verify();
    });
  });
});
