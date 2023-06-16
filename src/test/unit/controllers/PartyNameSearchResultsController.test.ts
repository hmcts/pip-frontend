import sinon from 'sinon';
import { Response } from 'express';
import PartyNameSearchResultsController from '../../../main/controllers/PartyNameSearchResultsController';
import { mockRequest } from '../mocks/mockRequest';
import { PublicationService } from '../../../main/service/publicationService';

const partyNameSearchResultsController = new PartyNameSearchResultsController();
const publicationServiceStub = sinon.stub(PublicationService.prototype, 'getCasesByPartyName');
publicationServiceStub.withArgs('').returns([]);

const searchInput = 'party name';

const foundResults = [
    { caseName: 'numberResult', caseNumber: '321322', partyNames: 'party name 1' },
    { caseName: 'urnResult', caseNumber: '321322', partyNames: 'party name 2', displayUrn: true },
];

publicationServiceStub.withArgs(searchInput).returns(foundResults);

describe('Party name search results controller', () => {
    const i18n = {
        'party-name-search-results': {},
    };
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    it('should render party name search results page if query param is valid', async () => {
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.query = { search: searchInput };
        const expectedData = {
            ...i18n['party-name-search'],
            searchResults: foundResults,
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('party-name-search-results', expectedData);
        return partyNameSearchResultsController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render error page is query param is invalid', async () => {
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.query = {};

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);
        await partyNameSearchResultsController.get(request, response);
        return responseMock.verify();
    });
});
