import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import CourtNameSearchController from '../../../main/controllers/CourtNameSearchController';
import { CourtService } from '../../../main/service/courtService';
import { CourtRequests } from '../../../main/resources/requests/courtRequests';
import { FilterService } from '../../../main/service/filterService';

const courtNameSearchController = new CourtNameSearchController();
sinon.stub(CourtService.prototype, 'fetchAllCourts').resolves([]);
sinon.stub(CourtRequests.prototype, 'getFilteredCourts').withArgs(['jurisdiction'], ['crown']).resolves([]);
const filterServiceStub = sinon.stub(FilterService.prototype, 'generateCheckboxGroup');
filterServiceStub.withArgs([], 'Jurisdiction', []).returns({});
filterServiceStub.withArgs([], 'Region', []).returns({});
filterServiceStub.withArgs(['crown'], 'Jurisdiction', []).returns({});
const selectedTagsStub = sinon.stub(FilterService.prototype, 'generateSelectedTags');
selectedTagsStub.withArgs([{jurisdiction: []}, {location: []}]).returns([]);
selectedTagsStub.withArgs([{jurisdiction: ['crown']}, {location: []}]).returns([]);
sinon.stub(CourtService.prototype, 'generateCourtsAlphabetObject').withArgs([]).returns({});

describe('Court Name Search Controller', () => {
  const i18n = {
    'court-name-search': {},
  };
  const expectedData = {
    ...i18n['court-name-search'],
    alphabeticalCourts: {},
    checkBoxesComponents: [{}, {}],
    categories: [],
  };
  const response = { render: () => {return '';}} as unknown as Response;
  const request = mockRequest(i18n);

  it('should render court name search page', () => {
    request.query = {};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('court-name-search', expectedData);

    return courtNameSearchController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render court name search page if reset all filters is applied', () => {
    request.query = {clear: 'all'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('court-name-search', expectedData);

    return courtNameSearchController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render court name search page if reset crown jurisdiction filter is applied', () => {
    request.query = {clear: 'crown'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('court-name-search', expectedData);

    return courtNameSearchController.get(request, response).then(() => {
      responseMock.verify();
    });
  });


  it('should render court name search page if reset london location filter is applied', () => {
    request.query = {clear: 'london'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('court-name-search', expectedData);

    return courtNameSearchController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render court name search page if filters are applied', () => {
    request.body = { jurisdiction: [], region: []};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('court-name-search', expectedData);

    return courtNameSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render court name search page if only jurisdiction filter is applied', () => {
    request.body = { jurisdiction: []};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('court-name-search', expectedData);

    return courtNameSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render court name search page when jurisdiction element is removed', async () => {
    request.body = { jurisdiction: ['crown']};

    await courtNameSearchController.post(request, response);
    request.query = {clear: 'crown'};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('court-name-search', expectedData);

    await courtNameSearchController.get(request, response);
    responseMock.verify();
  });

  it('should render court name search page when region element is removed', async () => {
    request.body = { region: ['london']};

    await courtNameSearchController.post(request, response);
    request.query = {clear: 'london'};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('court-name-search', expectedData);

    await courtNameSearchController.get(request, response);
    responseMock.verify();
  });

  it('should render court name search page if only region filter is applied', () => {
    request.body = { region: []};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('court-name-search', expectedData);

    return courtNameSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render court name search page if no filters are applied', () => {
    request.body = {};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('court-name-search', expectedData);

    return courtNameSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render court name search page when one jurisdiction is removed and there are still other jurisdiction filters', async () => {
    request.body = { jurisdiction: ['crown', 'crown court']};

    await courtNameSearchController.post(request, response);
    request.query = {clear: 'crown court'};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('court-name-search', expectedData);

    await courtNameSearchController.get(request, response);
    responseMock.verify();
  });
});
