import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/bulk-unsubscribe-confirmation';
let htmlRes: Document;

expressRequest['user'] = { roles: 'VERIFIED' };

describe('Bulk Unsubscribe Confirmation Page', () => {
    describe('without error', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains(
                'Are you sure you want to remove these subscriptions?',
                'Page title does not match'
            );
        });

        it('should have correct header', () => {
            const heading = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(heading[0].innerHTML).contains(
                'Are you sure you want to remove these subscriptions?',
                'Header does not match'
            );
        });

        it('should display 2 radio options with valid values', () => {
            const radios = htmlRes.getElementsByClassName('govuk-radios__input');
            expect(radios.length).equals(2, 'Could not find all radio buttons');
            expect(radios[0].getAttribute('value')).equals('yes', 'Could not find valid radio value');
            expect(radios[1].getAttribute('value')).equals('no', 'Could not find valid radio value');
        });

        it('should display continue button', () => {
            const buttons = htmlRes.getElementsByClassName('govuk-button');
            expect(buttons[0].innerHTML).contains('Continue', 'Could not find button');
        });
    });

    describe('with error', () => {
        beforeAll(async () => {
            await request(app)
                .post(PAGE_URL)
                .send({ locationId: '5', artefactId: 'foo' })
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display error summary', () => {
            const dialog = htmlRes.getElementsByClassName('govuk-error-summary');
            expect(dialog[0].getElementsByClassName('govuk-error-summary__title')[0].innerHTML).contains(
                'There is a problem',
                'Could not find error dialog title'
            );
        });

        it('should display error messages in the summary', () => {
            const list = htmlRes.getElementsByClassName(' govuk-error-summary__list')[0];
            const listItems = list.getElementsByTagName('a');
            expect(listItems[0].innerHTML).contains('An option must be selected', 'Could not find error');
        });
    });
});
