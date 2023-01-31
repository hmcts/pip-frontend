import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import sinon from 'sinon';
import { FileHandlingService } from '../../main/service/fileHandlingService';
import { CreateAccountService } from '../../main/service/createAccountService';

const PAGE_URL = '/bulk-create-media-accounts';

const fileName1 = 'fileName1';
const fileName2 = 'fileName2';
const file1 = 'file1';
const file2 = 'file2';

app.request['user'] = { roles: 'SYSTEM_ADMIN' };
app.request['file'] = { originalname: fileName1 };
app.request['lng'] = 'en';

sinon.stub(FileHandlingService.prototype, 'validateFileUpload').returns(null);
sinon.stub(FileHandlingService.prototype, 'storeFileIntoRedis').resolves({});

const readFileStub = sinon.stub(FileHandlingService.prototype, 'readFile');
const validateFileStub = sinon.stub(CreateAccountService.prototype, 'validateCsvFileContent');

readFileStub.withArgs(fileName1).returns(file1);
readFileStub.withArgs(fileName2).returns(file2);

validateFileStub
    .withArgs(file1, 3, ['email', 'firstName', 'surname'], 'en', 'bulk-create-media-accounts')
    .returns(null);
validateFileStub
    .withArgs(file2, 3, ['email', 'firstName', 'surname'], 'en', 'bulk-create-media-accounts')
    .returns('error');

describe('Bulk create media accounts', () => {
    describe('on GET', () => {
        test('should render bulk create media accounts page', async () => {
            app.request['file'] = { originalname: fileName1 };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to bulk create media accounts confirmation page if no error', async () => {
            app.request['file'] = { originalname: fileName1 };
            await request(app)
                .post(PAGE_URL)
                .send()
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('bulk-create-media-accounts-confirmation');
                });
        });

        test('should render bulk create media accounts page if validation error', async () => {
            app.request['file'] = { originalname: fileName2 };
            await request(app)
                .post(PAGE_URL)
                .send()
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
