import sinon from 'sinon';
import {Response} from 'express';
import AlphabeticalSearchController from '../../../main/controllers/AlphabeticalSearchController';
import fs from 'fs';
import path from 'path';
import {CourtService} from '../../../main/service/courtService';
import {mockRequest} from '../mocks/mockRequest';
import {FilterService} from '../../../main/service/filterService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtList = JSON.parse(rawData);
const alphabeticalSearchController = new AlphabeticalSearchController();

sinon.stub(CourtService.prototype, 'generateAlphabetisedAllCourtList').resolves(courtList);
const filteredCourtStub = sinon.stub(CourtService.prototype, 'generateFilteredAlphabetisedCourtList');
filteredCourtStub.resolves(courtList);
sinon.stub(CourtService.prototype, 'fetchAllCourts').resolves(courtList);
sinon.stub(FilterService.prototype, 'buildFilterValueOptions').returns([]);
sinon.stub(FilterService.prototype, 'handleFilterClear').returns(['test']);
sinon.stub(FilterService.prototype, 'splitFilters').returns({'Region':'testRegion','Jurisdiction':'testJurisdiction'});
sinon.stub(FilterService.prototype, 'findAndSplitFilters').returns({'Region':'testRegion','Jurisdiction':'testJurisdiction'});

const i18n = {
  'alphabetical-search': {},
};

describe('Alphabetical Search Controller', () => {
  describe('get', () => {
    it('should render the alphabetical search page', () => {
      const response = {
        render: function() {return '';},
      } as unknown as Response;
      const request = mockRequest(i18n);
      request.query = {};

      const responseMock = sinon.mock(response);

      const expectedData = {
        ...i18n['alphabetical-search'],
        courtList: courtList,
        filterOptions: [],
      };

      responseMock.expects('render').once().withArgs('alphabetical-search', expectedData);

      return alphabeticalSearchController.get(request, response).then(() => {
        responseMock.verify();
      });
    });

    it('should render the alphabetical search page with a query param', () => {
      const response = {
        render: function() {return '';},
      } as unknown as Response;
      const request = mockRequest(i18n);
      request.query = {clear: 'all'};

      const responseMock = sinon.mock(response);

      const expectedData = {
        ...i18n['alphabetical-search'],
        courtList: courtList,
        filterOptions: [],
      };

      responseMock.expects('render').once().withArgs('alphabetical-search', expectedData);

      return alphabeticalSearchController.get(request, response).then(() => {
        responseMock.verify();
      });
    });
  });
  describe('post', () => {
    it('should render page with body', () => {
      const response = {
        render: function() {return '';},
      } as unknown as Response;
      const request = mockRequest(i18n);
      request.body = {Jurisdiction: 'Manchester'};

      const responseMock = sinon.mock(response);

      const expectedData = {
        ...i18n['alphabetical-search'],
        courtList: courtList,
        filterOptions: [],
      };

      responseMock.expects('render').once().withArgs('alphabetical-search', expectedData);

      return alphabeticalSearchController.post(request, response).then(() => {
        responseMock.verify();
      });
    });
  });
});
