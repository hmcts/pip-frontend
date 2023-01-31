import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { LocationService } from '../../main/service/locationService';

sinon.stub(LocationService.prototype, 'generateAlphabetisedCrownCourtList').returns([]);

describe.skip('Search option', () => {
    describe('on GET', () => {
        test('should return search option page', async () => {
            await request(app)
                .get('/live-case-alphabet-search')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
