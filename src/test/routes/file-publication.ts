import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
const Blob = require('node-blob');
import { PublicationService} from '../../main/service/publicationService';
import {UserService} from '../../main/service/userService';

const mockPDF = new Blob(['testPDF']);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationFile').resolves(mockPDF);
const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(UserService.prototype, 'getPandIUserId').resolves(null);

describe('Show flat file publications', () => {
  describe('on GET', () => {

    test('should return file publication for PDF files', async () => {
      metadataStub.withArgs('0', null).resolves(JSON.parse('{"isFlatFile":"true", "sourceArtefactId":"doc.pdf"}'));
      await request(app)
        .get('/file-publication?artefactId=0')
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should return file publication for docx files', async () => {
      metadataStub.withArgs('1', null).resolves(JSON.parse('{"isFlatFile":"true", "sourceArtefactId":"doc.docx"}'));
      await request(app)
        .get('/file-publication?artefactId=1')
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should return file publication for json files', async () => {
      metadataStub.withArgs('2', null).resolves(JSON.parse('{"isFlatFile":"true", "sourceArtefactId":"doc.json"}'));
      await request(app)
        .get('/file-publication?artefactId=2')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
