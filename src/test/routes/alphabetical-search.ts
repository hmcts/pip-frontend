import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { FilterService } from '../../main/service/filterService';

const options = {
    alphabetisedList: {},
    filterOptions: {},
};

describe('Alphabetical search', () => {
    describe('on GET', () => {
        test('should return search option page', async () => {
            sinon.stub(FilterService.prototype, 'handleFilterInitialisation').resolves(options);

            await request(app)
                .get('/alphabetical-search')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should return search option page', () => {
            request(app)
                .post('/alphabetical-search')
                .expect(res => expect(res.status).to.equal(302));
        });
    });
});
