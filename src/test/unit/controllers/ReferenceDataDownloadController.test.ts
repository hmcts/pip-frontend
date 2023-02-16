import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { LocationRequests } from '../../../main/resources/requests/locationRequests';
import ReferenceDataDownloadController from '../../../main/controllers/ReferenceDataDownloadController';

const fileStub = sinon.stub(LocationRequests.prototype, 'getLocationsCsv');

const mockFile = new Blob(['testFile']);
const i18n = {};
const response = {
    send: function () {
        return '';
    },
    set: function () {
        return '';
    },
} as unknown as Response;

describe('Reference Data Download Controller', () => {
    const referenceDataDownloadController = new ReferenceDataDownloadController();

    it('should return a csv file', async () => {
        fileStub.withArgs('1234').resolves(mockFile);
        const request = mockRequest(i18n);

        request.user = { userId: '1234' };
        const responseMock = sinon.mock(response);

        responseMock.expects('set').once().withArgs('Content-Disposition', 'inline;filename=referenceData.csv');
        responseMock.expects('set').once().withArgs('Content-Type', 'application/csv');
        responseMock.expects('send').once().withArgs(mockFile);

        await referenceDataDownloadController.get(request, response);
        responseMock.verify();
    });
});
