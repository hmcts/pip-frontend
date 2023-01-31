import SearchController from '../../../main/controllers/SearchController';
import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { LocationService } from '../../../main/service/locationService';
import { mockRequest } from '../mocks/mockRequest';

const searchController = new SearchController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtList = JSON.parse(rawData);
sinon.stub(LocationService.prototype, 'fetchAllLocations').returns(courtList);
const stubCourt = sinon.stub(LocationService.prototype, 'getLocationByName');

describe('Search Controller', () => {
    const i18n = { search: {} };
    it('should render the search page', () => {
        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['search'],
            autocompleteList: courtList,
            noResultsError: false,
        };

        responseMock.expects('render').once().withArgs('search', expectedData);

        return searchController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render search page if no input is provided', () => {
        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'input-autocomplete': '' };

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['search'],
            autocompleteList: courtList,
            noResultsError: true,
        };

        responseMock.expects('render').once().withArgs('search', expectedData);
        return searchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render search page if there are no matching results', () => {
        stubCourt.returns(null);
        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'input-autocomplete': 'test' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['search'],
            autocompleteList: courtList,
            noResultsError: true,
        };

        responseMock.expects('render').once().withArgs('search', expectedData);
        return searchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render search page if input is three characters long and partially correct as noResultsError', () => {
        stubCourt.returns(null);
        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'input-autocomplete': 'Mut' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['search'],
            autocompleteList: courtList,
            noResultsError: true,
        };

        responseMock.expects('render').once().withArgs('search', expectedData);
        return searchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should redirect to hearing list page with input as query if court name input is valid', () => {
        const court = {
            locationId: 1,
        };
        stubCourt.returns(court);
        const response = {
            redirect: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'input-autocomplete': 'Valid Court' };
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('summary-of-publications?locationId=1');
        return searchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });
});
