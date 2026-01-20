import { expect } from 'chai';
import { app } from '../../../../main/app';
import request from 'supertest';

const PAGE_URL = '/manage-third-party-subscriber-oauth-config-success';

app.request['user'] = {
    roles: 'SYSTEM_ADMIN',
};

let htmlRes: Document;

describe('Create third party oauth config success page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display success panel', () => {
        const header = htmlRes.getElementsByClassName('govuk-panel__title')[0];
        expect(header.innerHTML).contains(
            'Third party subscriber oauth config updated',
            'Panel message does not match'
        );
    });
});
