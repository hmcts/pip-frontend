import request from 'supertest';
import {app} from '../../../main/app';
import {expect} from 'chai';
import sinon from 'sinon';

import {request as expressRequest} from 'express';
import {PublicationService} from '../../../main/service/publicationService';
import {LocationService} from '../../../main/service/locationService';

const PAGE_URL = '/blob-view-json?artefactId=1234';
let htmlRes: Document;

expressRequest['user'] = {
  'piUserId': '10',
  '_json': {
    'extension_UserRole': 'SYSTEM_ADMIN',
  }};

const artefactJson = '{"danny":true}';
const jsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const metaStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
const CourtStub = sinon.stub(LocationService.prototype, 'getLocationById');
const meta = {
  'artefactId': '1234',
  'displayFrom': '2022-06-29T14:45:18.836',
  'locationId': '1',
  'name': 'hi',
  'listType': 'SJP_PUBLIC_LIST',
};
jsonStub.withArgs('1234').resolves(artefactJson);
metaStub.resolves(meta);
CourtStub.withArgs(1).resolves(JSON.parse('{"name":"Single Justice Procedure"}'));

describe.skip('Create System Admin Account Page', () => {
  describe('on GET', () => {
    beforeAll(async () => {
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        htmlRes.getElementsByTagName('div')[0].remove();
      });
    });

    it('should display header', () => {
      const header = htmlRes.getElementsByClassName('govuk-heading-l');
      expect(header[0].innerHTML).contains('Create system admin account', 'Could not find the header');
    });
  });

});
