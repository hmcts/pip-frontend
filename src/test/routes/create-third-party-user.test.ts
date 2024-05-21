import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import sinon from 'sinon';
import { request as expressRequest } from 'express';
import { ThirdPartyService } from '../../main/service/ThirdPartyService';

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

const userRoleList = [
    {
        value: 'GENERAL_THIRD_PARTY',
        text: 'General third party',
        checked: true,
        hint: {
            text: 'User allowed access to public and private publications only',
        },
    },
    {
        value: 'VERIFIED_THIRD_PARTY_ALL',
        text: 'Verified third party - All',
        checked: true,
        hint: {
            text: 'User allowed access to classified publications for all list types',
        },
    },
];

sinon.stub(ThirdPartyService.prototype, 'buildThirdPartyRoleList').returns(userRoleList);

describe('Create third party user page', () => {
    describe('on GET', () => {
        test('should render create third party user page', async () => {
            await request(app)
                .get('/create-third-party-user')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should render create third party user page with errors', async () => {
            await request(app)
                .post('/create-third-party-user')
                .send({})
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should redirect to create third party user summary page', async () => {
            await request(app)
                .post('/create-third-party-user')
                .send({ thirdPartyName: 'name', thirdPartyRole: 'GENERAL_THIRD_PARTY' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/create-third-party-user-summary');
                });
        });
    });
});
