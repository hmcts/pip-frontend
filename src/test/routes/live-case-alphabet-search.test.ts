import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import {CourtService} from '../../main/service/courtService';

sinon.stub(CourtService.prototype, 'generateAlphabetisedCrownCourtList').returns([]);

describe('Search option', () => {
  describe('on GET', () => {
    test('should return search option page', async () => {
      await request(app)
        .get('/live-case-alphabet-search')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
