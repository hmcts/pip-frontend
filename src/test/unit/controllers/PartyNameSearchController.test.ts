import sinon from 'sinon';
import { Response } from 'express';
import PartyNameSearchController from '../../../main/controllers/PartyNameSearchController';
import { mockRequest } from '../mocks/mockRequest';
import { PublicationService } from '../../../main/service/publicationService';

const partyNameSearchController = new PartyNameSearchController();
const publicationServiceStub = sinon.stub(PublicationService.prototype, 'getCasesByPartyName');
publicationServiceStub.withArgs('').returns([]);
publicationServiceStub.withArgs('one-result').returns([{}]);
publicationServiceStub.withArgs('no-result').returns([]);

describe('Party name search controller', () => {
    const i18n = {
        'party-name-search': {},
    };

    it('should render party name search page', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.query = {};
        const expectedData = {
            ...i18n['party-name-search'],
            noResultsError: false,
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('party-name-search', expectedData);
        partyNameSearchController.get(request, response);
        responseMock.verify();
    });

    it('should render party name search page if there are search errors', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.query = { error: 'true' };
        const expectedData = {
            ...i18n['party-name-search'],
            noResultsError: true,
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('party-name-search', expectedData);
        partyNameSearchController.get(request, response);
        responseMock.verify();
    });

    it('should redirect to party name search results page if there are search results', async () => {
        const response = {
            redirect: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.body = { 'party-name': 'one-result' };

        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('party-name-search-results?search=one-result');
        return partyNameSearchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render same page if there are no search results', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.body = { 'party-name': 'no-result' };
        const expectedData = {
            ...i18n['party-name-search'],
            noResultsError: true,
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('party-name-search', expectedData);
        return partyNameSearchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render same page if no search term is entered', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.body = {};
        const expectedData = {
            ...i18n['party-name-search'],
            minimumCharacterError: true,
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('party-name-search', expectedData);
        return partyNameSearchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render same page if a search term of less than 3 characters is entered', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.body = { 'party-name': 'bo' };
        const expectedData = {
            ...i18n['party-name-search'],
            minimumCharacterError: true,
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('party-name-search', expectedData);
        return partyNameSearchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });
});
