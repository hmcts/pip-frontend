import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import Blob from 'node-blob';
import { LocationRequests } from '../../../main/resources/requests/LocationRequests';

const mockCsv = new Blob(['testCsv']);

const fileStub = sinon.stub(LocationRequests.prototype, 'getLocationsCsv');

describe('Download reference data download', () => {
    describe('on GET', () => {
        test('should return csv file', async () => {
            fileStub.withArgs('1234').resolves(mockCsv);
            app.request['user'] = { userId: '1234' };
            await request(app)
                .get('/manual-reference-data-download')
                .expect(res => expect(res.status).to.equal(302));
        });
    });
});
