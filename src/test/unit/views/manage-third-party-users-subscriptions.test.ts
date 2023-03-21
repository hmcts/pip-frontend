import request from 'supertest';
import { app } from '../../../main/app';
import { request as expressRequest } from 'express';
import { expect } from 'chai';
import { ThirdPartyService } from '../../../main/service/thirdPartyService';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/publicationService';
import { SubscriptionService } from '../../../main/service/subscriptionService';

describe('Manage third party subscription', () => {
    const PAGE_URL = '/manage-third-party-users/subscriptions';
    let htmlRes: Document;

    const headingClass = 'govuk-heading-l';
    const subHeadingsClass = 'govuk-fieldset__heading';
    const radioLabelClass = 'govuk-radios__label';
    const radioInputClass = 'govuk-radios__input';
    const mediumHeadingClass = 'govuk-heading-m';
    const listTypeClass = 'govuk-table__row';
    const checkboxesInputClass = 'govuk-checkboxes__input';

    expressRequest['user'] = {
        roles: 'SYSTEM_ADMIN',
    };

    const userId = '1234-1234';
    const getThirdPartyUserByIdStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartyUserById');
    const getListTypesStub = sinon.stub(PublicationService.prototype, 'getListTypes');
    const getSubscriptionsByUserStub = sinon.stub(SubscriptionService.prototype, 'getSubscriptionsByUser');
    const getChannelsListStub = sinon.stub(SubscriptionService.prototype, 'retrieveChannels');

    getThirdPartyUserByIdStub.withArgs(userId).resolves({ userId: userId });
    getListTypesStub.returns(
        new Map([
            ['LIST_A', { friendlyName: 'List A' }],
            ['LIST_B', { friendlyName: 'List B' }],
        ])
    );

    getSubscriptionsByUserStub.withArgs(userId).resolves({
        listTypeSubscriptions: [
            {
                listType: 'LIST_B',
                channel: 'CHANNEL_B',
            },
        ],
    });

    getChannelsListStub.resolves(['CHANNEL_A', 'EMAIL', 'CHANNEL_B']);

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
        expect(header[0].innerHTML).contains('Manage Third Party Subscriptions', 'Could not find the header');
    });

    it('should display channel header', () => {
        const subHeadings = htmlRes.getElementsByClassName(subHeadingsClass);
        expect(subHeadings[0].innerHTML).contains('Please select a Channel', 'Could not find the header');
    });

    it('should display radio button label', () => {
        const radioLabels = htmlRes.getElementsByClassName(radioLabelClass);
        expect(radioLabels[0].innerHTML).contains('CHANNEL_A', 'Could not find the radio label');
    });

    it('should display radio unchecked', () => {
        const radioInputs = htmlRes.getElementsByClassName(radioInputClass);
        expect(radioInputs[0].hasAttribute('checked')).to.be.false;
    });

    it('should display radio button label', () => {
        const radioLabels = htmlRes.getElementsByClassName(radioLabelClass);
        expect(radioLabels[1].innerHTML).contains('CHANNEL_B', 'Could not find the radio label');
    });

    it('should display radio checked', () => {
        const radioInputs = htmlRes.getElementsByClassName(radioInputClass);
        expect(radioInputs[1].hasAttribute('checked')).to.be.true;
    });

    it('should display list header', () => {
        const subHeadings = htmlRes.getElementsByClassName(mediumHeadingClass);
        expect(subHeadings[0].innerHTML).contains('Please select list types', 'Could not find the header');
    });

    it('should display the list types', () => {
        const listTypes = htmlRes.getElementsByClassName(listTypeClass);
        expect(listTypes[0].innerHTML).contains('List A', 'Could not find the list type');
    });

    it('should display checkbox unchecked', () => {
        const checkboxInputs = htmlRes.getElementsByClassName(checkboxesInputClass);
        expect(checkboxInputs[0].hasAttribute('checked')).to.be.false;
    });

    it('should display the list types', () => {
        const listTypes = htmlRes.getElementsByClassName(listTypeClass);
        expect(listTypes[1].innerHTML).contains('List B', 'Could not find the list type');
    });

    it('should display checkbox checked', () => {
        const checkboxInputs = htmlRes.getElementsByClassName(checkboxesInputClass);
        expect(checkboxInputs[1].hasAttribute('checked')).to.be.true;
    });
});
