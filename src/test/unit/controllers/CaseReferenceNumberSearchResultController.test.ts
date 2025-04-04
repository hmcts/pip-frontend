import sinon from 'sinon';
import { Response } from 'express';
import CaseReferenceNumberSearchResultController from '../../../main/controllers/CaseReferenceNumberSearchResultController';

import { mockRequest } from '../mocks/mockRequest';
import { PublicationService } from '../../../main/service/PublicationService';

const caseReferenceNumberSearchResultController = new CaseReferenceNumberSearchResultController();
const caseNumberStub = sinon.stub(PublicationService.prototype, 'getCaseByCaseNumber');
const caseUrnStub = sinon.stub(PublicationService.prototype, 'getCaseByCaseUrn');

const validCaseNo = '56-181-2097';
const validCaseUrn = '123456';

const subscriptionsCaseData = { caseName: 'name', caseNumber: '1234', caseUrn: '12345', partyNames: 'name1' };

caseNumberStub.withArgs(validCaseNo).returns(subscriptionsCaseData);
caseUrnStub.withArgs(validCaseUrn).returns(subscriptionsCaseData);

const response = {
    render: function () {
        return '';
    },
} as unknown as Response;

describe('Case Reference Number Search Result Controller', () => {
    const i18n = {};
    describe('GET requests', () => {
        it('should render the search result page with case number search type', () => {
            const request = mockRequest(i18n);
            request.query = {
                'search-input': validCaseNo,
                'search-type': 'case-number',
            };
            request.user = { userId: '1' };
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n['case-reference-number-search-results'],
                searchInput: validCaseNo,
                searchResults: subscriptionsCaseData,
                urnSearch: false,
            };

            responseMock.expects('render').once().withArgs('case-reference-number-search-results', expectedData);

            return caseReferenceNumberSearchResultController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the search result page with case URN search type', () => {
            const request = mockRequest(i18n);
            request.query = {
                'search-input': validCaseUrn,
                'search-type': 'case-urn',
            };
            request.user = { userId: '1' };
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n['case-reference-number-search-results'],
                searchInput: validCaseUrn,
                searchResults: subscriptionsCaseData,
                urnSearch: true,
            };

            responseMock.expects('render').once().withArgs('case-reference-number-search-results', expectedData);

            return caseReferenceNumberSearchResultController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the error page if search type not provided', () => {
            const request = mockRequest(i18n);
            request.query = { 'search-input': validCaseNo };
            request.user = { userId: '1' };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            return caseReferenceNumberSearchResultController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the error page if invalid search type', () => {
            const request = mockRequest(i18n);
            request.query = {
                'search-input': validCaseNo,
                'search-type': 'invalid-type',
            };
            request.user = { userId: '1' };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            return caseReferenceNumberSearchResultController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render an error page if search input does not return any results', () => {
            const request = mockRequest(i18n);
            request.query = {};
            request.user = { userId: '1' };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            return caseReferenceNumberSearchResultController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
    describe('POST requests', () => {
        it('should render pending subscription page once case reference/urn subscription is confirmed', () => {
            const response = {
                redirect: () => {
                    return '';
                },
            } as unknown as Response;
            const request = mockRequest(i18n);
            const responseMock = sinon.mock(response);
            responseMock.expects('redirect').once().withArgs('/pending-subscriptions');
            return caseReferenceNumberSearchResultController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
