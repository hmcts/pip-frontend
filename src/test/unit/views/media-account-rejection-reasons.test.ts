import { app } from '../../../main/app';
import sinon from 'sinon';
import request from 'supertest';
import { expect } from 'chai';
import { MediaAccountApplicationService } from '../../../main/service/mediaAccountApplicationService';
import { request as expressRequest } from 'express';
import { randomUUID } from 'crypto';

const applicationId = randomUUID();

const PAGE_URL = '/media-account-rejection-reasons?applicantId=' + applicationId;

let htmlRes: Document;

const dummyApplication = {
    id: '1234',
    fullName: 'Test Name',
    email: 'a@b.com',
    employer: 'employer',
    image: '12345',
    imageName: 'ImageName.jpg',
    requestDate: '09 May 2022',
    status: 'PENDING',
    statusDate: '2022-05-09T00:00:01',
};

sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus').returns(dummyApplication);

expressRequest['user'] = { roles: 'INTERNAL_ADMIN_CTSC' };

describe('Media Account Rejection Reasons Page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });
    it('should display service name', () => {
        const expectedServiceName = 'Court and tribunal hearings';
        const tableCaptionClass = 'govuk-header__service-name';
        const header = htmlRes.getElementsByClassName(tableCaptionClass);
        expect(header[0].innerHTML).contains(expectedServiceName, 'Could not find the table caption');
    });

    it('should display the footer', () => {
        const footer = htmlRes.getElementsByTagName('footer');
        expect(footer.length).greaterThan(0, 'Could not find the footer');
    });

    it('should have the correct content for .govuk-fieldset__heading', () => {
        const govukFieldsetHeading = htmlRes.getElementsByClassName('govuk-fieldset__heading')[0];
        const content = govukFieldsetHeading.textContent;
        expect(content).to.contain('Why are you rejecting this application?');
    });

    it('should have the correct content for the govuk-label with class .govuk-checkboxes__label', () => {
        const labels = htmlRes.getElementsByClassName('govuk-label govuk-checkboxes__label');
        const label = Array.from(labels).find(el => el.getAttribute('for') === 'rejection-reasons');
        const content = label.textContent.trim();

        expect(content).to.contain('The applicant is not an accredited member of the media.');
    });

    it('should have the correct content for the button with class .govuk-button', () => {
        const buttons = htmlRes.getElementsByClassName('govuk-button');
        const button = Array.from(buttons).find(el => el.getAttribute('id') === 'button');
        const content = button.textContent.trim();

        expect(content).to.contain('Continue');
    });
});
