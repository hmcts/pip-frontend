import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Case Event Glossary search', () => {
  describe('on GET', () => {
    test('should return case event glossary page', () => {
      request(app)
        .get('/case-event-glossary')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
