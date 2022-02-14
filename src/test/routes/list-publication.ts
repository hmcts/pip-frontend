import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { SummaryOfPublicationsService} from '../../main/service/summaryOfPublicationsService';

const mockJSON = '{"data":"false"}';
sinon.stub(SummaryOfPublicationsService.prototype, 'getIndivPubMetadata').resolves('{"isFlatFile":"false"}');
sinon.stub(SummaryOfPublicationsService.prototype, 'getIndivPubFile').resolves(mockJSON);

describe('', () => {
  describe('on GET', () => {
    test('should return file publication', async () => {
      await request(app)
        .get('/list-publication?artefactId=0')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
