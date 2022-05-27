import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import request from 'supertest';
import sinon from 'sinon';
import { CourtService } from '../../main/service/courtService';
import fs from 'fs';
import path from 'path';

const URL = '/remove-list-search';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);
const courtStub = sinon.stub(CourtService.prototype, 'getCourtByName');
const rawCourts = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/courtAndHearings.json'), 'utf-8');
const courtList = JSON.parse(rawCourts);
const court = { locationId: 2 };
sinon.stub(CourtService.prototype, 'fetchAllCourts').returns(courtList);
courtStub.withArgs('').resolves(null);
courtStub.withArgs('foo').resolves(null);
courtStub.withArgs('Accrington County Court').resolves(court);

describe('Remove List Search', () => {
  describe('on GET', () => {
    test('should return remove list search page', async () => {
      await request(app)
        .get(URL)
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should return remove list search page', async () => {
      await request(app)
        .post(URL)
        .send({'input-autocomplete': ''})
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should return remove list search page', async () => {
      await request(app)
        .post(URL)
        .send({'input-autocomplete': 'foo'})
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should redirect to removal confirmation page', async () => {
      await request(app)
        .post(URL)
        .send({'input-autocomplete': 'Accrington County Court'})
        .expect((res) => {
          expect(res.status).to.equal(302);
          expect(res.header['location']).to.equal('remove-list-search-results?courtId=2');
        });
    });
  });
});
