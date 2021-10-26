import HearingListController from '../../../main/controllers/HearingListController';
import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import {CourtService} from '../../../main/service/courtService';
import {mockRequest} from '../mocks/mockRequest';
import moment from 'moment';

const hearingListController = new HearingListController();
const stub = sinon.stub(CourtService.prototype, 'getCourtById');
const stubGetCourtList = sinon.stub(CourtService.prototype, 'getCourtByName');

let i18n = {};

describe('Hearing list Controller', () => {
  it('should render the list page if the court ID exists', () =>  {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
    const hearingsData = JSON.parse(rawData)[0];

    stub.withArgs(1).returns(hearingsData);

    i18n = {
      'hearing-list': {},
    };

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {courtId: '1'};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['hearing-list'],
      courtName: hearingsData.name,
      hearings: hearingsData.hearingList,
      date: moment().format('MMMM DD YYYY'),
    };

    responseMock.expects('render').once().withArgs('hearing-list', expectedData);

    return hearingListController.get(request, response).then(() => {
      responseMock.verify();
    });

  });

  it('should render the list page if the court name exists', () =>  {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/hearingsListByCourt.json'), 'utf-8');
    const hearingsData = JSON.parse(rawData);

    const rawCourtsData = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/courtsAndHearingsCount.json'), 'utf-8');
    const courtsData = JSON.parse(rawCourtsData);

    stub.withArgs(1).returns(hearingsData);
    stubGetCourtList.withArgs('Abergavenny Magistrates\' Court').returns(courtsData);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {'search-input': 'Abergavenny Magistrates\' Court'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('hearing-list');

    return hearingListController.get(request, response).then(() => {
      responseMock.verify();
    });

  });

  it('should render an error page if a court ID that does not return any results', () =>  {
    stub.withArgs(1400).returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);

    request.query = {courtId: '1400'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    return hearingListController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render an error page if a court ID is not defined', () =>  {
    stub.withArgs({}).returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);

    request.query = {};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    return hearingListController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

});
