import request from 'supertest';
import { app } from '../../../../main/app';
import { request as expressRequest } from 'express';
import { expect } from 'chai';
import { ThirdPartyService } from '../../../../main/service/ThirdPartyService';
import sinon from 'sinon';

describe('Manage third party subscribers - view', () => {
    const PAGE_URL = '/manage-third-party-subscribers/view';
    let htmlRes: Document;

    const headingClass = 'govuk-heading-l';
    const summaryKey = 'govuk-summary-list__key';
    const summaryValue = 'govuk-summary-list__value';
    const buttonClass = 'govuk-button';

    expressRequest['user'] = {
        roles: 'SYSTEM_ADMIN',
    };

    const userId = '1234-1234';

    const getThirdPartySubscriberStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscriberById');

    getThirdPartySubscriberStub.withArgs(userId).resolves({
        userId: '1234-1234',
        name: 'ThisIsAName',
        createdDate: '18th November 2022',
    });

    describe('Manage third party subscribers - view without subs', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL + '?userId=' + userId)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName(headingClass);
            expect(header[0].innerHTML).contains('Manage subscriber', 'Could not find the header');
        });

        it('should display name list header', () => {
            const summaryKeys = htmlRes.getElementsByClassName(summaryKey);
            expect(summaryKeys[0].innerHTML).contains('Name', 'Could not find the header');
        });

        it('should display created date header', () => {
            const summaryKeys = htmlRes.getElementsByClassName(summaryKey);
            expect(summaryKeys[1].innerHTML).contains('Created Date', 'Could not find the header');
        });

        it('name should be correct', () => {
            const summaryValues = htmlRes.getElementsByClassName(summaryValue);
            expect(summaryValues[0].innerHTML).contains('ThisIsAName', 'Summary name is incorrect');
        });

        it('created date should be correct', () => {
            const summaryValues = htmlRes.getElementsByClassName(summaryValue);
            expect(summaryValues[1].innerHTML).contains('18th November 2022', 'Created date is incorrect');
        });

        it('manage subscriptions button should be correct', () => {
            const buttons = htmlRes.getElementsByClassName(buttonClass);
            expect(buttons[0].innerHTML).contains('Manage subscriptions', 'Button does not contain the correct text');
        });

        it('manage oath configuration button should be correct', () => {
            const buttons = htmlRes.getElementsByClassName(buttonClass);
            expect(buttons[1].innerHTML).contains(
                'Manage OAuth configuration',
                'Button does not contain the correct text'
            );
        });

        it('delete subscriber button should be correct', () => {
            const buttons = htmlRes.getElementsByClassName(buttonClass);
            expect(buttons[2].innerHTML).contains('Delete subscriber', 'Button does not contain the correct text');
        });
    });
});
