import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';

const pAndIRedirectUrl = '/login?p=B2C_1_SignInUserFlow';
const CftAccountUrl = '/cft-login';
const CrimeAccountUrl = '/crime-login';
const urlOptions = [
    {
        name: 'hmcts',
        path: CftAccountUrl,
    },
    {
        name: 'common',
        path: CrimeAccountUrl,
    },
    {
        name: 'pi',
        path: pAndIRedirectUrl,
    },
];

describe('Sign In option', () => {
    describe('on GET', () => {
        test('should return sign-in routing page', async () => {
            await request(app)
                .get('/sign-in')
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('How do you want to sign in?');
                });
        });

        test('should return sign-in page if there is no radio selected', async () => {
            await request(app)
                .get('/sign-in?error=true')
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('How do you want to sign in?')
                });
        });
    });

    for (let i = 0; i < urlOptions.length; i++) {
        describe('on POST', () => {
            test('should redirect to external url when ' + urlOptions[i].name + ' is chosen', async () => {
                await request(app)
                    .post('/sign-in')
                    .send({ 'sign-in': urlOptions[i].name })
                    .expect(res => {
                        expect(res.status).to.equal(302);
                        expect(res.header['location']).to.equal(urlOptions[i].path);
                    });
            });

            test('should re-render the sign-in page', async () => {
                await request(app)
                    .post('/sign-in')
                    .send({})
                    .expect(res => {
                        expect(res.status).to.equal(302);
                        expect(res.header['location']).to.equal('/sign-in?error=true');
                    });
            });

        });
    }
});
