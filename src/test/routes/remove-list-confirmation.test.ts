import { request as expressRequest } from 'express';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { expect } from 'chai';
import { PublicationService } from '../../main/service/publicationService';
import { CourtService } from '../../main/service/courtService';

const URL = '/remove-list-confirmation';

const mockArtefact = {
  listType: 'CIVIL_DAILY_CAUSE_LIST',
  listTypeName: 'Civil Daily Cause List',
  contentDate: '2022-03-24T07:36:35',
  courtId: '1',
  artefactId: 'valid-artefact',
};
sinon.stub(expressRequest, 'isAuthenticated').returns(true);
const removePublicationStub = sinon.stub(PublicationService.prototype, 'removePublication');
const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(CourtService.prototype, 'getCourtById').resolves({courtId: '1', name: 'Mock Court'});
removePublicationStub.withArgs('valid-artefact', 'joe@bloggs.com').resolves(true);
removePublicationStub.withArgs('invalid-artefact', 'joe@bloggs.com').resolves(false);
metadataStub.withArgs('valid-artefact', true).resolves(mockArtefact);
metadataStub.withArgs('invalid-artefact', true).resolves({...mockArtefact, artefactId: 'invalid-artefact'});

describe('Remove List Confirmation', () => {
  app.request['user'] = {emails: ['joe@bloggs.com']};

  describe('on GET', () => {
    test('should return remove list confirmation page', async () => {
      await request(app)
        .get(URL+ '?artefact=valid-artefact&court=1')
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should return error page', async () => {
      await request(app)
        .get(URL)
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should redirect to remove list success page choice if yes and request is success', async () => {
      await request(app)
        .post(URL).send({
          'remove-choice': 'yes',
          'artefactId': 'valid-artefact',
        })
        .expect((res) => {
          expect(res.status).to.equal(302);
          expect(res.header['location']).to.equal('/remove-list-success');
        });
    });

    test('should return error page if choice is yes and request fails', async () => {
      await request(app)
        .post(URL).send({
          'remove-choice': 'yes',
          'artefactId': 'invalid-artefact',
        })
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should redirect to remove list summary page if choice is no', async () => {
      await request(app)
        .post(URL).send({
          'remove-choice': 'no',
          'artefactId': 'valid-artefact',
          'courtId': '1',
        })
        .expect((res) => {
          expect(res.status).to.equal(302);
          expect(res.header['location']).to.equal('/remove-list-search-results?courtId=1');
        });
    });

    test('should return remove list confirmation page if choice is blank', async () => {
      await request(app)
        .post(URL).send({
          'artefactId': 'valid-artefact',
          'courtId': '1',
        })
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
