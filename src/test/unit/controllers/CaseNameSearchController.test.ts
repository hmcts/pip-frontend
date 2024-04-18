import sinon from 'sinon';
import { Response } from 'express';
import CaseNameSearchController from '../../../main/controllers/CaseNameSearchController';
import { mockRequest } from '../mocks/mockRequest';
import { PublicationService } from '../../../main/service/publicationService';

const caseNameSearchController = new CaseNameSearchController();
const publicationServiceStub = sinon.stub(PublicationService.prototype, 'getCasesByCaseName');
publicationServiceStub.withArgs('').returns([]);
publicationServiceStub.withArgs('one-result').returns([{}]);
publicationServiceStub.withArgs('bob').returns([]);

describe('Case name search controller', () => {
    const i18n = {
        'case-name-search': {},
    };

    it('should render case name search page', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.query = {};
        const expectedData = {
            ...i18n['case-name-search'],
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('case-name-search', expectedData);
        caseNameSearchController.get(request, response);
        responseMock.verify();
    });

    it('should render case name search page if there are search errors', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.query = { error: 'true' };
        const expectedData = {
            ...i18n['case-name-search'],
            noResultsError: true,
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('case-name-search', expectedData);
        caseNameSearchController.get(request, response);
        responseMock.verify();
    });

    it('should redirect to case name search results page if there are search results', async () => {
        const response = {
            redirect: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.body = { 'case-name': 'one-result' };

        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('case-name-search-results?search=one-result');
        return caseNameSearchController.post(request, response).then(() => {
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
        request.body = { 'case-name': 'bob' };
        const expectedData = {
            ...i18n['case-name-search'],
            noResultsError: true,
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('case-name-search', expectedData);
        return caseNameSearchController.post(request, response).then(() => {
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
            ...i18n['case-name-search'],
            minimumCharacterError: true,
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('case-name-search', expectedData);
        return caseNameSearchController.post(request, response).then(() => {
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
        request.body = { 'case-name': 'bo' };
        const expectedData = {
            ...i18n['case-name-search'],
            minimumCharacterError: true,
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('case-name-search', expectedData);
        return caseNameSearchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });
});
