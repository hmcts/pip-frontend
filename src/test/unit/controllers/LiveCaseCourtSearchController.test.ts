import sinon from 'sinon';
import { Response } from 'express';
import LiveCaseCourtSearchController from '../../../main/controllers/LiveCaseCourtSearchController';
import fs from 'fs';
import path from 'path';
import { LocationService } from '../../../main/service/locationService';
import { mockRequest } from '../mocks/mockRequest';

const liveCaseCourtSearchController = new LiveCaseCourtSearchController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtsAndHearings = JSON.parse(rawData);
sinon.stub(LocationService.prototype, 'generateAlphabetisedCrownCourtList').returns(courtsAndHearings);

describe.skip('Live Case Location Search Controller', () => {
    it('should render live cases alphabetical page', () => {
        const i18n = {
            'live-case-alphabet-search': {},
        };

        const response = {
            render: () => {
                return '';
            },
            get: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['live-case-alphabet-search'],
            courtList: courtsAndHearings,
        };

        responseMock.expects('render').once().withArgs('live-case-alphabet-search', expectedData);

        return liveCaseCourtSearchController.get(request, response).then(() => {
            responseMock.verify();
        });
    });
});
