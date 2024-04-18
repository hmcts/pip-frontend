import sinon from 'sinon';
import { Response } from 'express';
import CaseNameSearchResultsController from '../../../main/controllers/CaseNameSearchResultsController';
import { mockRequest } from '../mocks/mockRequest';
import { PublicationService } from '../../../main/service/publicationService';

const caseNameSearchResultsController = new CaseNameSearchResultsController();
const publicationServiceStub = sinon.stub(PublicationService.prototype, 'getCasesByCaseName');
publicationServiceStub.withArgs('').returns([]);

const caseSubscription = { caseName: 'name', caseNumber: '124', partyNames: 'name1' };
const caseSubscription2 = { caseName: 'name2', caseUrn: '126', partyNames: 'name2', displayUrn: true };
const caseSubscription3 = { caseName: 'name2', caseNumber: '125', partyNames: 'name3' };
const caseSubscription4 = { caseName: 'name', caseUrn: '123', partyNames: 'name4', displayUrn: true };

publicationServiceStub
    .withArgs('urnAndNumberResults')
    .returns([caseSubscription, caseSubscription2, caseSubscription3, caseSubscription4]);

describe('Case name search results controller', () => {
    const i18n = {
        'case-name-search-results': {},
    };
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    it('should render case name search results page if query param is valid', async () => {
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.query = { search: 'urnAndNumberResults' };
        const expectedData = {
            ...i18n['case-name-search'],
            searchResults: [caseSubscription4, caseSubscription, caseSubscription3, caseSubscription2],
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('case-name-search-results', expectedData);
        return caseNameSearchResultsController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render error page is query param is invalid', async () => {
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.query = {};

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);
        await caseNameSearchResultsController.get(request, response);
        return responseMock.verify();
    });
});
