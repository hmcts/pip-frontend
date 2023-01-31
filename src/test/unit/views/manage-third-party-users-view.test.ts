import request from 'supertest';
import { app } from '../../../main/app';
import { request as expressRequest } from 'express';
import { expect } from 'chai';
import { ThirdPartyService } from '../../../main/service/thirdPartyService';
import sinon from 'sinon';
import { SubscriptionService } from '../../../main/service/subscriptionService';

describe('Manage third party users - view', () => {
    const PAGE_URL = '/manage-third-party-users/view';
    let htmlRes: Document;

    const headingClass = 'govuk-heading-l';
    const summaryKey = 'govuk-summary-list__key';
    const summaryValue = 'govuk-summary-list__value';
    const buttonClass = 'govuk-button';

    expressRequest['user'] = {
        roles: 'SYSTEM_ADMIN',
    };

    const userId = '1234-1234';

    const getThirdPartyUserStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartyUserById');
    const getSubscriptionsByUser = sinon.stub(SubscriptionService.prototype, 'getSubscriptionsByUser');

    getThirdPartyUserStub.withArgs(userId).resolves({
        userId: '1234-1234',
        provenanceUserId: 'ThisIsAName',
        roles: 'GENERAL_THIRD_PARTY',
        createdDate: '18th November 2022',
    });

    describe('Manage third party users - view without subs', () => {
        getSubscriptionsByUser.withArgs(userId).resolves({ listTypeSubscriptions: [] });

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
            expect(header[0].innerHTML).contains('Manage User', 'Could not find the header');
        });

        it('should display name list header', () => {
            const summaryKeys = htmlRes.getElementsByClassName(summaryKey);
            expect(summaryKeys[0].innerHTML).contains('Name', 'Could not find the header');
        });

        it('should display role list header', () => {
            const summaryKeys = htmlRes.getElementsByClassName(summaryKey);
            expect(summaryKeys[1].innerHTML).contains('Role', 'Could not find the header');
        });

        it('should display created date header', () => {
            const summaryKeys = htmlRes.getElementsByClassName(summaryKey);
            expect(summaryKeys[2].innerHTML).contains('Created Date', 'Could not find the header');
        });

        it('should display number of subscriptions header', () => {
            const summaryKeys = htmlRes.getElementsByClassName(summaryKey);
            expect(summaryKeys[3].innerHTML).contains('Number of Subscriptions', 'Could not find the header');
        });

        it('should display subscriptions channel header', () => {
            const summaryKeys = htmlRes.getElementsByClassName(summaryKey);
            expect(summaryKeys[4].innerHTML).contains('Subscriptions Channel', 'Could not find the header');
        });

        it('name should be correct', () => {
            const summaryValues = htmlRes.getElementsByClassName(summaryValue);
            expect(summaryValues[0].innerHTML).contains('ThisIsAName', 'Summary name is incorrect');
        });

        it('role should be correct', () => {
            const summaryValues = htmlRes.getElementsByClassName(summaryValue);
            expect(summaryValues[1].innerHTML).contains('GENERAL_THIRD_PARTY', 'Third party role is incorrect');
        });

        it('created date should be correct', () => {
            const summaryValues = htmlRes.getElementsByClassName(summaryValue);
            expect(summaryValues[2].innerHTML).contains('18th November 2022', 'Created date is incorrect');
        });

        it('number of subscriptions should be correct', () => {
            const summaryValues = htmlRes.getElementsByClassName(summaryValue);
            expect(summaryValues[3].innerHTML).contains('0', 'Number of subscriptions is incorrect');
        });

        it('subscriptions channel should be correct', () => {
            const summaryValues = htmlRes.getElementsByClassName(summaryValue);
            expect(summaryValues[4].innerHTML).contains('N/A - No subscriptions', 'Channel is incorrect');
        });

        it('manage subscriptions button should be correct', () => {
            const buttons = htmlRes.getElementsByClassName(buttonClass);
            expect(buttons[0].innerHTML).contains('Manage Subscriptions', 'Button does not contain the correct text');
        });
    });

    describe('Manage third party users - with subs', () => {
        const userIdWithSubs = '2345-2345';

        getThirdPartyUserStub.withArgs(userIdWithSubs).resolves({
            userId: '2345-2345',
            provenanceUserId: 'ThisIsAName',
            roles: 'GENERAL_THIRD_PARTY',
            createdDate: '18th November 2022',
        });

        getSubscriptionsByUser.withArgs(userIdWithSubs).resolves({
            listTypeSubscriptions: [
                {
                    subscriptionId: '2345-2345',
                    channel: 'TEST_CHANNEL',
                },
            ],
        });

        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL + '?userId=' + userIdWithSubs)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('number of subscriptions should be correct', () => {
            const summaryValues = htmlRes.getElementsByClassName(summaryValue);
            expect(summaryValues[3].innerHTML).contains('1', 'Number of subscriptions is incorrect');
        });

        it('subscriptions channel should be correct', () => {
            const summaryValues = htmlRes.getElementsByClassName(summaryValue);
            expect(summaryValues[4].innerHTML).contains('TEST_CHANNEL', 'Channel is incorrect');
        });
    });
});
