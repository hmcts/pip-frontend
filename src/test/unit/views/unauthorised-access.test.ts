import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { PublicationService } from '../../../main/service/PublicationService';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';
import { request as expressRequest } from 'express';

const PAGE_URL = '/list-download-files?artefactId=abc';

let htmlRes: Document;

const mockArtefact = {
    listType: 'SJP_PRESS_LIST',
    sensitivity: 'CLASSIFIED',
};

sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(mockArtefact);
sinon.stub(AccountManagementRequests.prototype, 'isAuthorised').resolves(false);

expressRequest['user'] = { roles: 'VERIFIED' };

describe('Unauthorised Access Page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(response => {
                htmlRes = new DOMParser().parseFromString(response.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains('Page not found', 'Page title does not match header');
    });

    it('should display page header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(header[0].innerHTML).contains('Page not found', 'Page header does not match');
    });

    it('should display message', () => {
        const body = htmlRes.getElementsByClassName('govuk-body');
        expect(body[0].innerHTML).contains(
            'You have attempted to view a page that you are not allowed to view based on your user type and the type of publication.',
            'Page message does not match'
        );
    });
});
