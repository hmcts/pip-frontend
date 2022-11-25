import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';
import {LocationService} from '../../main/service/locationService';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';

const rawCourts = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/courtAndHearings.json'), 'utf-8');
const courtList = JSON.parse(rawCourts);
sinon.stub(LocationService.prototype, 'fetchAllLocations').returns(courtList);

describe('Delete court reference data', () => {
  describe('on GET', () => {
    test('should return list of all the courts available in reference data', async () => {
      app.request['user'] = {'_json': {
        'extension_UserRole': 'SYSTEM_ADMIN',
      }};
      await request(app)
        .get('/delete-court-reference-data')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
