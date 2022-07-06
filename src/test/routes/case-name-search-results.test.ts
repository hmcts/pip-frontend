import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';
import {request as expressRequest} from 'express';

expressRequest['user'] = {'_json': {
  'extension_UserRole': 'VERIFIED',
}};

describe('Case name search', () => {
  describe('on GET', () => {
    test('should return case name search results page', () => {
      request(app)
        .get('/case-name-search-results?search=alo')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
