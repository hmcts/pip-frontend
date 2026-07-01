import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/download-mi-report';

let htmlRes: Document;

describe('Download MI Report Page', () => {
    beforeAll(async () => {
        expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display the heading', () => {
        const heading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(heading[0].innerHTML).contains('Download MI Report', 'Could not find heading');
    });

    it('should display the description', () => {
        const body = htmlRes.getElementsByClassName('govuk-body');
        expect(body[4].innerHTML).contains(
            'Report duration applies only to the Publications report. All other reports will include data from the beginning.',
            'Could not find description'
        );
    });

    it('should display the report duration select', () => {
        const reportDuration = htmlRes.getElementById('reportDuration');
        expect(reportDuration).not.to.be.null;
    });

    it('should display the report type select', () => {
        const reportType = htmlRes.getElementById('reportType');
        expect(reportType).not.to.be.null;
    });

    it('should display the download button', () => {
        const button = htmlRes.getElementsByClassName('govuk-button');
        expect(button[4].innerHTML).contains('Download', 'Could not find download button');
    });
});
