import sinon from 'sinon';
import {Response} from 'express';
import AlphabeticalSearchController from '../../../main/controllers/AlphabeticalSearchController';

import {mockRequest} from '../mocks/mockRequest';
import {FilterService} from '../../../main/service/filterService';

const alphabeticalSearchController = new AlphabeticalSearchController();

sinon.stub(FilterService.prototype, 'handleFilterInitialisation').resolves({alphabetisedList: {}, filterOptions: {}});

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
        courtList: {},
        filterOptions: {},
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
        courtList: {},
        filterOptions: {},
      };

      responseMock.expects('render').once().withArgs('alphabetical-search', expectedData);

      return alphabeticalSearchController.get(request, response).then(() => {
        responseMock.verify();
      });
    });
  });
  describe('post', () => {
    const response = {
      redirect: function() {return '';}} as unknown as Response;

    it('should render page with body', () => {
      const request = mockRequest(i18n);
      request.body = {Jurisdiction: 'Manchester'};

      const responseMock = sinon.mock(response);

      responseMock.expects('redirect').once().withArgs('alphabetical-search?filterValues=Manchester');

      return alphabeticalSearchController.post(request, response).then(() => {
        responseMock.verify();
      });
    });

    it('should render page after switching Region for Location', () => {
      const request = mockRequest(i18n);
      request.body = {Region: 'Crown'};

      const responseMock = sinon.mock(response);

      responseMock.expects('redirect').once().withArgs('alphabetical-search?filterValues=Crown');

      return alphabeticalSearchController.post(request, response).then(() => {
        responseMock.verify();
      });
    });
  });
});
