import sinon from 'sinon';
import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import {PublicationService} from '../../main/service/publicationService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/summaryOfPublications.json'), 'utf-8');
const summaryOfPublicationsData = JSON.parse(rawData);
sinon.stub(PublicationService.prototype, 'getPublications').resolves(summaryOfPublicationsData);

describe('', () => {
  describe('on GET', () => {
    test('should return summary of publications page', async () => {
      await request(app)
        .get('/summary-of-publications?courtId=0')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
