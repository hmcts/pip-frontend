import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/PublicationService';

const PAGE_URL = '/edit-list-type-search-config-summary';

const formDataCreate = {
    listType: 'SJP_PUBLIC_LIST',
    createConfig: 'true',
    caseNumberFieldName: 'caseNumber',
    caseNameFieldName: 'caseName',
};

const formDataUpdate = {
    id: 'config-123',
    listType: 'SJP_PUBLIC_LIST',
    caseNumberFieldName: 'caseNumber',
    caseNameFieldName: 'caseName',
};

const createListSearchConfigStub = sinon.stub(PublicationService.prototype, 'createListSearchConfig');
const updateListSearchConfigStub = sinon.stub(PublicationService.prototype, 'updateListSearchConfig');

createListSearchConfigStub.withArgs(formDataCreate, '2').resolves(true);
updateListSearchConfigStub.withArgs(formDataUpdate.id, formDataUpdate, '2').resolves(true);

describe('Edit list type search config summary page', () => {
    describe('on GET', () => {
        test('should render summary page', async () => {
            app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };
            app.request['cookies'] = { listSearchConfigCookie: JSON.stringify(formDataCreate) };

            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to success page when creating new config', async () => {
            app.request['user'] = { userId: '2', roles: 'SYSTEM_ADMIN' };
            app.request['cookies'] = { listSearchConfigCookie: JSON.stringify(formDataCreate) };

            await request(app)
                .post(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/edit-list-type-search-config-success');
                });
        });

        test('should redirect to success page when updating existing config', async () => {
            app.request['user'] = { userId: '2', roles: 'SYSTEM_ADMIN' };
            app.request['cookies'] = { listSearchConfigCookie: JSON.stringify(formDataUpdate) };

            await request(app)
                .post(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/edit-list-type-search-config-success');
                });
        });

        test('should render summary page with error when service fails', async () => {
            app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };
            app.request['cookies'] = { listSearchConfigCookie: JSON.stringify(formDataCreate) };

            await request(app)
                .post(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
