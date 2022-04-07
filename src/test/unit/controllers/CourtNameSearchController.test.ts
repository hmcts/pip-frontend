import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import CourtNameSearchController from '../../../main/controllers/CourtNameSearchController';
import { CourtService } from '../../../main/service/courtService';
import { FilterService } from '../../../main/service/filterService';

const alphabet = {
  A: {}, B: {}, C: {}, D: {}, E: {}, F: {}, G: {}, H: {}, I: {}, J: {}, K: {}, L: {}, M: {},
  N: {}, O: {}, P: {}, Q: {}, R: {}, S: {}, T: {}, U: {}, V: {}, W: {}, X: {}, Y: {}, Z: {},
};
const courtNameSearchController = new CourtNameSearchController();
sinon.stub(CourtService.prototype, 'fetchAllCourts').resolves([]);
sinon.stub(CourtService.prototype, 'generateFilteredAlphabetisedCourtList').resolves({});
sinon.stub(FilterService.prototype, 'buildFilterValueOptions').returns({});
sinon.stub(FilterService.prototype, 'splitFilters').returns({'Region':'test','Jurisdiction':'test'});
sinon.stub(FilterService.prototype, 'findAndSplitFilters').returns({'Region':'test','Jurisdiction':'test'});

describe('Court Name Search Controller', () => {
  const i18n = {
    'court-name-search': {},
  };
  const expectedData = {
    ...i18n['court-name-search'],
    filterOptions: {},
    courtList: alphabet,
  };
  const postExpectedData = {
    ...i18n['court-name-search'],
    filterOptions: {},
    courtList: {},
  };
  const response = { render: () => {return '';}} as unknown as Response;
  const request = mockRequest(i18n);

  describe('GET requests', () => {
    it('should render court name search page', () => {
      request.query = {};

      const responseMock = sinon.mock(response);

      responseMock.expects('render').once().withArgs('court-name-search', expectedData);

      return courtNameSearchController.get(request, response).then(() => {
        responseMock.verify();
      });
    });

    it('should render court name search page if invalid query param is provided', () => {
      request.query = {foo: 'blah'};

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

    it('should render court name search page when one jurisdiction is removed and there are still other jurisdiction filters', async () => {
      request.body = { jurisdiction: ['crown', 'crown court'], region: []};

      await courtNameSearchController.post(request, response);
      request.query = {clear: 'crown court'};
      const responseMock = sinon.mock(response);

      responseMock.expects('render').once().withArgs('court-name-search', postExpectedData);

      await courtNameSearchController.get(request, response);
      responseMock.verify();
    });
  });

  describe('POST requests', () => {
    it('should render court name search page if filters are applied', () => {
      request.body = { jurisdiction: [], region: []};

      const responseMock = sinon.mock(response);

      responseMock.expects('render').once().withArgs('court-name-search', postExpectedData);

      return courtNameSearchController.post(request, response).then(() => {
        responseMock.verify();
      });
    });

    it('should render court name search page if more than 2 filters are applied', () => {
      request.body = { jurisdiction: ['crown'], region: ['london']};

      const responseMock = sinon.mock(response);

      responseMock.expects('render').once().withArgs('court-name-search', postExpectedData);

      return courtNameSearchController.post(request, response).then(() => {
        responseMock.verify();
      });
    });

    it('should render court name search page if only jurisdiction filter is applied', () => {
      request.body = { jurisdiction: []};

      const responseMock = sinon.mock(response);

      responseMock.expects('render').once().withArgs('court-name-search', postExpectedData);

      return courtNameSearchController.post(request, response).then(() => {
        responseMock.verify();
      });
    });

    it('should render court name search page if only region filter is applied', () => {
      request.body = { region: []};

      const responseMock = sinon.mock(response);

      responseMock.expects('render').once().withArgs('court-name-search', postExpectedData);

      return courtNameSearchController.post(request, response).then(() => {
        responseMock.verify();
      });
    });

    it('should render court name search page if no filters are applied', () => {
      request.body = {};

      const responseMock = sinon.mock(response);

      responseMock.expects('render').once().withArgs('court-name-search', postExpectedData);

      return courtNameSearchController.post(request, response).then(() => {
        responseMock.verify();
      });
    });
  });
});
