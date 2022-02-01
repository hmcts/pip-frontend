import sinon from 'sinon';
import { Response } from 'express';
import DailyCauseListController from '../../../main/controllers/DailyCauseListController';
import fs from 'fs';
import path from 'path';
import {DailyCauseListService} from '../../../main/service/dailyCauseListService';
import {mockRequest} from '../mocks/mockRequest';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const searchResults = JSON.parse(rawData);
const dailyCauseListController = new DailyCauseListController();

sinon.stub(DailyCauseListService.prototype, 'getDailyCauseList').resolves(searchResults);

const i18n = {
  'daily-cause-list': {},
};

describe('Daily Cause List Controller', () => {
  it('should render the daily cause list page', () =>  {

    const response = {
      render: function() {return '';},
    } as unknown as Response;
    const request = mockRequest(i18n);

    request.query = {artefactId: '10b6e951-2746-4fab-acad-564dcac9c58d'};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['daily-cause-list'],
      searchResults,
    };

    responseMock.expects('render').once().withArgs('daily-cause-list', expectedData);

    return dailyCauseListController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

});
