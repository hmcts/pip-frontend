import sinon from 'sinon';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import LocalApiController from '../../../main/controllers/LocalApiController';
jest.mock('axios');


const rawData = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/courtsAllReduced.json'), 'utf-8');
const courtsAll = JSON.parse(rawData);
const rawData2 = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/courtAndHearings2.json'), 'utf-8');
const courts = JSON.parse(rawData2);
const hearingsRawData =  fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/hearingsList.json'), 'utf-8');
const hearings = JSON.parse(hearingsRawData);

describe('Local Api Controller for all courts list', () => {
  it('should return a mock data for all court list', () =>  {
    const localApiController = new LocalApiController();



    const response = {
      send: function() {return Object.values(courtsAll);},
    } as unknown as Response;
    const request = {query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('send').once();

    localApiController.apiAllCourtList(request, response);

    responseMock.verify();
  });
});

describe('Local Api Controller for search court for input text', () => {
  it('should return a mock data for court list matching the input search', () =>  {
    const localApiController = new LocalApiController();



    const response = {
      send: function() {return Object.values(courts);},
    } as unknown as Response;
    const request = { params: { courtId: '1'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('send').once();

    localApiController.apiHearingsList(request, response);

    responseMock.verify();
  });
});

describe('Local Api Controller for search hearings for a court id', () => {
  it('should return a mock data for hearings list matching the court id', () =>  {
    const localApiController = new LocalApiController();

    const response = {
      send: function() {return Object.values(courts);},
    } as unknown as Response;
    const request = { params: { input: 'Accrington'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('send').once();

    localApiController.apiCourtList(request, response);

    responseMock.verify();
  });
});


describe('Local Api Controller for case name filtering', () => {
  it('should return mock data for partial case name matching', () => {
    const localApiController = new LocalApiController();

    const response = {
      send: () => {return Object.values(hearings);},
    } as unknown as Response;
    const request = { params: { input: 'Meed'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('send').once();

    localApiController.apiFindHearings(request, response);

    responseMock.verify();
  });
});
