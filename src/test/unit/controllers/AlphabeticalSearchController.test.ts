import sinon from 'sinon';
import { Response } from 'express';
import AlphabeticalSearchController from '../../../main/controllers/AlphabeticalSearchController';
import fs from 'fs';
import path from 'path';
import {CourtService} from '../../../main/service/courtService';
import {mockRequest} from '../utils/mockRequest';


const rawData = fs.readFileSync(path.resolve(__dirname, '../utils/mocks/courtAndHearings.json'), 'utf-8');
const courtList = JSON.parse(rawData);
const alphabeticalSearchController = new AlphabeticalSearchController();

sinon.stub(CourtService.prototype, 'generateAlphabetisedCourtList').returns(courtList);

describe('Alphabetical Search Controller', () => {
  it('should render the alphabetical search page', () =>  {

    const i18n = {
      'alphabetical-search': {},
    };

    const response = {
      render: function() {return '';},
    } as unknown as Response;
    const request = mockRequest(i18n);

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['alphabetical-search'],
      courtList: courtList,
    };

    responseMock.expects('render').once().withArgs('alphabetical-search', expectedData);

    return alphabeticalSearchController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
});
