import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import sinon from 'sinon';
import { ThirdPartyRequests } from '../../../main/resources/requests/ThirdPartyRequests';

sinon.stub(ThirdPartyRequests.prototype, 'getThirdPartySubscriberByUserId').resolves({ name: 'thirdPartyName' });
const deleteUserStub = sinon.stub(ThirdPartyRequests.prototype, 'deleteThirdPartySubscriber');
deleteUserStub.withArgs('123', '1').resolves('success');
deleteUserStub.withArgs('124', '1').resolves(null);

describe('Delete third party subscriber confirmation page', () => {
    app.request['user'] = {
        userId: '1',
        roles: 'SYSTEM_ADMIN',
    };

    describe('on GET', () => {
        test('should render delete third party subscriber confirmation page', async () => {
            await request(app)
                .get('/delete-third-party-subscriber-confirmation')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to delete third party subscriber success page for successful delete subscriber response', async () => {
            app.request['body'] = {
                user: '123',
                'delete-subscriber-confirm': 'yes',
            };

            await request(app)
                .post('/delete-third-party-subscriber-confirmation')
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/delete-third-party-subscriber-success');
                });
        });

        test('should render delete third party subscriber confirmation page with error', async () => {
            app.request['body'] = {
                user: '124',
                'delete-subscriber-confirm': 'yes',
            };

            await request(app)
                .post('/delete-third-party-subscriber-confirmation')
                .expect(res => expect(res.status).to.equal(200));
        });

        test("should redirect to manage third party subscriber page for a 'no' response", async () => {
            app.request['body'] = {
                user: '123',
                'delete-subscriber-confirm': 'no',
            };

            await request(app)
                .post('/delete-third-party-subscriber-confirmation')
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/manage-third-party-subscribers/view?userId=123');
                });
        });
    });
});
