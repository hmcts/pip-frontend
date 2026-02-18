import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { CreateAccountService } from '../../main/service/CreateAccountService';
import sinon from 'sinon';
import { FileHandlingService } from '../../main/service/FileHandlingService';

const responseNoErrors = {
    nameError: {
        message: null,
        href: '#fullName',
    },
    emailError: {
        message: null,
        href: '#emailAddress',
    },
    employerError: {
        message: null,
        href: '#employer',
    },
    fileUploadError: {
        message: null,
        href: '#file-upload',
    },
};

const responseErrors = {
    nameError: {
        message: 'error',
        href: '#fullName',
    },
    emailError: {
        message: null,
        href: '#emailAddress',
    },
    employerError: {
        message: null,
        href: '#employer',
    },
    fileUploadError: {
        message: null,
        href: '#file-upload',
    },
};

const validateFormFieldsStub = sinon.stub(CreateAccountService.prototype, 'validateFormFields');
validateFormFieldsStub.withArgs({ 'test-body': 1 }).returns(responseNoErrors);
validateFormFieldsStub.withArgs({ 'test-body': 2 }).returns(responseErrors);

const createMediaAccountStub = sinon.stub(CreateAccountService.prototype, 'createMediaApplication');
createMediaAccountStub.resolves(true);

sinon.stub(FileHandlingService.prototype, 'removeFile').returns('');

describe('Create media account page', () => {
    describe('on GET', () => {
        test('should return create media account page', async () => {
            await request(app)
                .get('/create-media-account')
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Create a Court and tribunal hearings account');
                });
        });
    });

    describe('on POST', () => {
        test('should redirect to account request submitted if valid', async () => {
            app.request['file'] = {};
            await request(app)
                .post('/create-media-account')
                .send({ 'test-body': 1 })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.headers['location']).to.contain('account-request-submitted');
                });
        });

        test('should render error state if invalid', async () => {
            app.request['file'] = {};
            await request(app)
                .post('/create-media-account')
                .send({ 'test-body': 2 })
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Create a Court and tribunal hearings account');
                });
        });
    });
});
