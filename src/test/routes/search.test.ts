import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';
import { LocationService } from '../../main/service/LocationService';
import sinon from 'sinon';

const stubCourt = sinon.stub(LocationService.prototype, 'getLocationByName');
stubCourt.withArgs('abc').resolves(undefined);
stubCourt.withArgs('abcd').resolves({'name': "Court 1"});

describe('Search', () => {
    describe('on GET', () => {
        test('should return search option page', async () => {
            await request(app)
                .get('/search')
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('What court or tribunal are you interested in?');
                });
        });
    });

    describe('on POST', () => {
        test('should return search page on error', async () => {
            await request(app)
                .post('/search')
                .send({'input-autocomplete': 'abc'})
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('What court or tribunal are you interested in?');
                });
        });

        test('should redirect to summary of pubs page on success', async () => {
            await request(app)
                .post('/search')
                .send({'input-autocomplete': 'abcd'})
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.contain('summary-of-publications');
                });
        });
    });
});
