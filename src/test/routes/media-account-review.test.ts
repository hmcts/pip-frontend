import request from 'supertest';
import {app} from '../../main/app';
import {expect} from 'chai';
import { MediaAccountApplicationService } from '../../main/service/mediaAccountApplicationService';
import sinon from 'sinon';
import {request as expressRequest} from 'express';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('Media Account Review Pages', () => {

  const applicationID = '1234';
  const imageID = '12345';

  const dummyApplication = {
    'id': '1234',
    'fullName': 'Test Name',
    'email': 'a@b.com',
    'employer': 'Employer',
    'image': '12345',
    'imageName': 'ImageName',
    'requestDate': '2022-05-09T00:00:01',
    'status': 'PENDING',
    'statusDate': '2022-05-09T00:00:01',
  };

  const getApplicationByIdStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationById');
  const getApplicationImageByIdStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationImageById');

  getApplicationByIdStub.withArgs(applicationID).resolves(dummyApplication);
  getApplicationImageByIdStub.withArgs(imageID).resolves('1234.jpg');

  describe('on View Image', () => {
    test('should return the image page', () => {
      request(app)
        .get('/media-account-review/image?imageId=' + imageID)
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

});
