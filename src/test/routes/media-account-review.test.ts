import request from 'supertest';
import {app} from '../../main/app';
import {expect} from 'chai';
import { MediaAccountApplicationService } from '../../main/service/mediaAccountApplicationService';
import sinon from 'sinon';
import {request as expressRequest} from 'express';
import {dummyApplication} from "../helpers/testConsts";

sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('Media Account Review Pages', () => {

  const applicationID = '1234';
  const imageID = '12345';

  const getApplicationByIdStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationById');
  const getImageByIdStub = sinon.stub(MediaAccountApplicationService.prototype, 'getImageById');

  getApplicationByIdStub.withArgs(applicationID).resolves(dummyApplication);
  getImageByIdStub.withArgs(imageID).resolves('1234.jpg');

  describe('on View Image', () => {
    test('should return the image page', () => {
      request(app)
        .get('/media-account-review/image?imageId=' + imageID)
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

});
