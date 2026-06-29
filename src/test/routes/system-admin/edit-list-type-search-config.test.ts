import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/PublicationService';

const PAGE_URL = '/edit-list-type-search-config?listType=SJP_PUBLIC_LIST';

sinon.stub(PublicationService.prototype, 'getListSearchConfigByListType').resolves({
    caseNumberFieldName: 'caseNumber',
    caseNameFieldName: 'caseName',
});

sinon.stub(PublicationService.prototype, 'getListTypes').returns(
    new Map([
        ['SJP_PUBLIC_LIST', { friendlyName: 'SJP Public List', isHidden: false }],
        [
            'FAMILY_DAILY_CAUSE_LIST',
            { friendlyName: 'Family Daily Cause List', isHidden: true, url: 'family-daily-cause-list' },
        ],
        [
            'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
            {
                friendlyName: 'Civil and Family Daily Cause List',
                isHidden: true,
                url: 'civil-and-family-daily-cause-list',
            },
        ],
    ]) as any
);

describe('Edit list type search config page', () => {
    describe('on GET', () => {
        test('should render edit list type search config page', async () => {
            app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to summary page when valid form data is submitted', async () => {
            app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .post(PAGE_URL)
                .send({ caseNumberFieldName: 'caseNumber', caseNameFieldName: 'caseName' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/edit-list-type-search-config-summary');
                });
        });
    });
});
