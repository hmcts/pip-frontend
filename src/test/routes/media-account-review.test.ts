import request from 'supertest';
import {app} from '../../main/app';
import {expect} from 'chai';
import { MediaAccountApplicationService } from '../../main/service/mediaAccountApplicationService';
import sinon from 'sinon';
import {AdminAuthentication} from '../../main/authentication/adminAuthentication';

sinon.stub(AdminAuthentication.prototype, 'isAdminUser').returns(true);

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

  describe('on GET', () => {
    test('should return the media account review page', () => {
      request(app)
        .get('/media-account-review?applicantId=' + applicationID)
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on Approve', () => {
    test('should return the admin-media-account-approval page', () => {
      request(app)
        .post('/media-account-review/approve')
        .send({'applicantId': applicationID})
        .expect((res) => expect(res.status).to.equal(404));
    });
  });

  describe('on Reject', () => {
    test('should return the admin-media-account-rejection page', () => {
      request(app)
        .post('/media-account-review/reject')
        .send({'applicantId': applicationID})
        .expect((res) => expect(res.status).to.equal(404));
    });
  });

  describe('on View Image', () => {
    test('should return the image page', () => {
      request(app)
        .get('/media-account-review/image?imageId=' + imageID)
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

});
