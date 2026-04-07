import { ThirdPartyService } from '../../../main/service/ThirdPartyService';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import sinon from 'sinon';

app.request['user'] = {
    userId: '1',
    roles: 'SYSTEM_ADMIN',
};

const getThirdPartySubscriptionsStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscriptionsByUserId');
getThirdPartySubscriptionsStub.withArgs('123').resolves([]);
getThirdPartySubscriptionsStub.withArgs('124').resolves([
    {
        userId: '124',
        listType: 'CIVIL_DAILY_CAUSE_LIST',
        sensitivity: 'PUBLIC',
    },
    {
        userId: '124',
        listType: 'FAMILY_DAILY_CAUSE_LIST',
        sensitivity: 'PRIVATE',
    },
]);

sinon.stub(ThirdPartyService.prototype, 'createThirdPartySubscriptions').resolves(true);
sinon.stub(ThirdPartyService.prototype, 'updateThirdPartySubscriptions').resolves(true);

describe('Manage third party subscriptions summary', () => {
    describe('on GET', () => {
        test('should return manage third party subscriptions summary page', async () => {
            await request(app)
                .get('/manage-third-party-subscriptions-summary?userId=123')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to manage third-party subscriptions created success page if existing subscriptions present', async () => {
            await request(app)
                .post('/manage-third-party-subscriptions-summary')
                .send({
                    userId: '123',
                })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/manage-third-party-subscriptions-created-success');
                });
        });

        test('should redirect to manage third-party subscriptions updated success page if no existing subscriptions', async () => {
            await request(app)
                .post('/manage-third-party-subscriptions-summary')
                .send({
                    userId: '124',
                })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/manage-third-party-subscriptions-updated-success');
                });
        });
    });
});
