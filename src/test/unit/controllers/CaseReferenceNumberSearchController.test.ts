import sinon from 'sinon';
import { Response } from 'express';
import CaseReferenceNumberSearchController from '../../../main/controllers/CaseReferenceNumberSearchController';
import { mockRequest } from '../mocks/mockRequest';
import { PublicationService } from '../../../main/service/PublicationService';

const caseReferenceNumberSearchController = new CaseReferenceNumberSearchController();
const caseNumberStub = sinon.stub(PublicationService.prototype, 'getCaseByCaseNumber');

const validCaseNo = '56-181-2097';

const subscriptionCaseResult = { caseName: 'name', caseNumber: '1234' };

describe('Case Reference Number Search Controller', () => {
    let i18n = {};
    it('should render the search page', () => {
        i18n = {
            'case-reference-number-search': {},
        };

        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['case-reference-number-search'],
        };

        responseMock.expects('render').once().withArgs('case-reference-number-search', expectedData);

        caseReferenceNumberSearchController.get(request, response);

        responseMock.verify();
    });

    it('should render case search page if there are no matching results', () => {
        caseNumberStub.withArgs(validCaseNo).returns(null);

        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.body = { 'search-input': validCaseNo };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('case-reference-number-search');

        return caseReferenceNumberSearchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render case search page if input is less than three characters long', () => {
        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.body = { 'search-input': '12' };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('case-reference-number-search');

        return caseReferenceNumberSearchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render case search page if input is three characters long and partially correct', () => {
        caseNumberStub.withArgs('1234').returns(null);

        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.body = { 'search-input': '1234' };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('case-reference-number-search');

        return caseReferenceNumberSearchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render case search page if no input is provided', () => {
        caseNumberStub.withArgs('').returns(null);

        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.body = { 'search-input': '' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('case-reference-number-search');

        return caseReferenceNumberSearchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render case search page if url is provided as search input', () => {
        caseNumberStub.withArgs('').returns(null);

        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.body = { 'search-input': 'http://localhost' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('case-reference-number-search');

        return caseReferenceNumberSearchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should redirect to case search results page with input as query if case number is valid', () => {
        const response = {
            redirect: function () {
                return '';
            },
            render: function () {
                return '';
            },
        } as unknown as Response;

        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.body = { 'search-input': validCaseNo };

        const responseMock = sinon.mock(response);
        caseNumberStub.withArgs(validCaseNo).returns(subscriptionCaseResult);

        responseMock
            .expects('redirect')
            .once()
            .withArgs(`case-reference-number-search-results?search-input=${validCaseNo}`);

        return caseReferenceNumberSearchController.post(request, response).then(() => {
            responseMock.verify();
        });
    });
});
