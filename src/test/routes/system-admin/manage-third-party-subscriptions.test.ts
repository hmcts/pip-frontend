import { ThirdPartyService } from '../../../main/service/ThirdPartyService';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import sinon from 'sinon';

app.request['user'] = {
    userId: '1',
    roles: 'SYSTEM_ADMIN',
};

describe('Manage third party subscriptions', () => {
    describe('on GET', () => {
        sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscriptionsByUserId').resolves([
            {
                userId: '123',
                listType: 'CIVIL_DAILY_CAUSE_LIST',
                sensitivity: 'PUBLIC',
            },
            {
                userId: '123',
                listType: 'FAMILY_DAILY_CAUSE_LIST',
                sensitivity: 'PRIVATE',
            },
        ]);

        test('should return manage third party subscriptions page', async () => {
            await request(app)
                .get('/manage-third-party-subscriptions?userId=123')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to manage third-party subscriptions summary page', async () => {
            await request(app)
                .post('/manage-third-party-subscriptions')
                .send({
                    userId: '123',
                })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/manage-third-party-subscriptions-summary?userId=123');
                });
        });
    });
});
