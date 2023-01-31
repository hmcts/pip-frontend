import sinon from 'sinon';
import { Response } from 'express';
import LiveCaseStatusController from '../../../main/controllers/LiveCaseStatusController';
import fs from 'fs';
import path from 'path';
import { LiveCaseService } from '../../../main/service/liveCaseService';
import { mockRequest } from '../mocks/mockRequest';
import { DateTime } from 'luxon';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/liveCaseStatusUpdates.json'), 'utf-8');
const liveCases = JSON.parse(rawData);
const stub = sinon.stub(LiveCaseService.prototype, 'getLiveCases');
stub.withArgs(1).returns(liveCases.results);
stub.withArgs(777).returns(null);

describe.skip('Live Status Controller', () => {
    const liveStatusController = new LiveCaseStatusController();
    let i18n = {};

    it('should render live updates if court ID exists', () => {
        i18n = {
            'live-case-status': {},
        };

        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = { locationId: '1' };

        const expectedData = {
            ...i18n['live-case-status'],
            locationName: liveCases.results[0].locationName,
            updateDate: DateTime.fromISO(liveCases.results[0].lastUpdated, {
                zone: 'utc',
            }).toFormat('dd MMMM yyyy'),
            updateTime: DateTime.fromISO(liveCases.results[0].lastUpdated, {
                zone: 'utc',
            })
                .toFormat('h:mma')
                .toLowerCase(),
            liveCases: liveCases.results[0].locationUpdates,
            refreshTimer: 15000,
            locationId: '1',
        };

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('live-case-status', expectedData);

        return liveStatusController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should redirect to not found page if a court ID that does not return any results', () => {
        const response = {
            redirect: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = { locationId: '777' };

        const responseMock = sinon.mock(response);
        responseMock.expects('redirect').once().withArgs('not-found');

        return liveStatusController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render an error page if a court ID is not defined', () => {
        i18n = {
            error: {},
        };

        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = {};

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        return liveStatusController.get(request, response).then(() => {
            responseMock.verify();
        });
    });
});
