import { app } from '../../main/app';
import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { LocationService } from '../../main/service/locationService';
import fs from 'fs';
import path from 'path';
import { request as expressRequest } from 'express';

const URL = '/delete-court-reference-data';

const courtStub = sinon.stub(LocationService.prototype, 'getLocationByName');
const rawCourts = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/courtAndHearings.json'), 'utf-8');
const courtList = JSON.parse(rawCourts);
const court = { locationId: 2 };
sinon.stub(LocationService.prototype, 'fetchAllLocations').returns(courtList);
courtStub.withArgs('').resolves(null);
courtStub.withArgs('foo').resolves(null);
courtStub.withArgs('Accrington County Location').resolves(court);

expressRequest['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };

describe('Delete Court List Search', () => {
    describe('on GET', () => {
        test('should return delete court list search page', async () => {
            await request(app)
                .get(URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should return delete court list search page', async () => {
            await request(app)
                .post(URL)
                .send({ 'input-autocomplete': '' })
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return delete court list search page', async () => {
            await request(app)
                .post(URL)
                .send({ 'input-autocomplete': 'foo' })
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should redirect to delete court confirmation page', async () => {
            await request(app)
                .post(URL)
                .send({ 'input-autocomplete': 'Accrington County Location' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('delete-court-reference-data-confirmation?locationId=2');
                });
        });
    });
});
