import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import {PublicationService} from '../../main/service/publicationService';
import sinon from 'sinon';
import {SummaryOfPublicationsService} from '../../main/service/summaryOfPublicationsService';

const mockJSON = '{"data":"false"}';
const mockArray = '[{"data":"false"}]';
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(mockJSON);
sinon.stub(SummaryOfPublicationsService.prototype, 'getPublications').resolves(mockArray);

describe('Summary of Publications', () => {
  describe('on GET', () => {
    test('should return summary of publications page', async () => {
      await request(app)
        .get('/summary-of-publications?courtId=0')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
