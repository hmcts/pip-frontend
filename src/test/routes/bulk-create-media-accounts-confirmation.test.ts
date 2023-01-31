import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import sinon from 'sinon';
import { FileHandlingService } from '../../main/service/fileHandlingService';
import { CreateAccountService } from '../../main/service/createAccountService';

const PAGE_URL = '/bulk-create-media-accounts-confirmation';
const fileName = 'fileName';
const mockData = { fileName: fileName, uploadFileName: fileName, file: '' };

app.request['cookies'] = { formCookie: JSON.stringify(mockData) };

const file = 'file';
const mockAccounts = [
    ['email', 'firstName', 'surname'],
    ['test1@test.com', 'firstName1', 'surname1'],
    ['test2@test.com', 'firstName2', 'surname2'],
];

sinon.stub(FileHandlingService.prototype, 'readFileFromRedis').resolves(file);
sinon.stub(FileHandlingService.prototype, 'readCsvToArray').returns(mockAccounts);

const createAccountsStub = sinon.stub(CreateAccountService.prototype, 'bulkCreateMediaAccounts');
createAccountsStub.withArgs(file, fileName, '1').resolves(true);
createAccountsStub.withArgs(file, fileName, '2').resolves(false);

describe('Bulk create media accounts confirmation', () => {
    describe('on GET', () => {
        app.request['user'] = {
            userId: '1',
            roles: 'SYSTEM_ADMIN',
        };
        test('should render bulk create media accounts confirmation page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        app.request['user'] = {
            userId: '1',
            roles: 'SYSTEM_ADMIN',
        };

        test("should redirect to bulk create media accounts page if 'Yes' is selected", async () => {
            await request(app)
                .post(PAGE_URL)
                .send({ confirmed: 'Yes' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('bulk-create-media-accounts-confirmed');
                });
        });

        test("should redirect to bulk create media accounts page if 'No' is selected", async () => {
            await request(app)
                .post(PAGE_URL)
                .send({ confirmed: 'No' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('bulk-create-media-accounts');
                });
        });

        test('should render bulk create media accounts confirmation if no option is selected', async () => {
            await request(app)
                .post(PAGE_URL)
                .send()
                .expect(res => expect(res.status).to.equal(200));
        });

        test("should render bulk create media accounts confirmation if 'Yes' is selected but accounts not created successfully", async () => {
            app.request['user'] = {
                userId: '2',
                roles: 'SYSTEM_ADMIN',
            };

            await request(app)
                .post(PAGE_URL)
                .send({ confirmed: 'Yes' })
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
