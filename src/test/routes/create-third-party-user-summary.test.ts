import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import sinon from 'sinon';
import { ThirdPartyService } from '../../main/service/ThirdPartyService';

const formData = { thirdPartyName: 'name', thirdPartyRole: 'GENERAL_THIRD_PARTY' };

const createThirdPartyStub = sinon.stub(ThirdPartyService.prototype, 'createThirdPartyUser');
createThirdPartyStub.withArgs(formData, '1').resolves(null);
createThirdPartyStub.withArgs(formData, '2').resolves('true');

describe('Create third party user summary page', () => {
    beforeEach(() => {
        app.request['cookies'] = { formCookie: JSON.stringify(formData) };
    });

    describe('on GET', () => {
        test('should render create third party user summary page', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };

            await request(app)
                .get('/create-third-party-user-summary')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should render create third party user summary page with errors', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };

            await request(app)
                .post('/create-third-party-user-summary')
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should redirect to create third party user success page', async () => {
            app.request['user'] = {
                userId: '2',
                roles: 'SYSTEM_ADMIN',
            };

            await request(app)
                .post('/create-third-party-user-summary')
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/create-third-party-user-success');
                });
        });
    });
});
