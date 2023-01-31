import request from 'supertest';
import { app } from '../../../main/app';
import { ThirdPartyService } from '../../../main/service/thirdPartyService';
import sinon from 'sinon';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

describe('Manage third party subscription confirm', () => {
    const PAGE_URL = '/manage-third-party-users/subscriptions';
    let htmlRes: Document;

    const summaryHeadingPanelClass = 'govuk-panel__title';
    const summaryBodyPanelClass = 'govuk-panel__body';
    const paragraphClass = 'govuk-body';
    const anchorTag = 'a';

    const userId = '1234-1234';

    const getThirdPartyUserByIdStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartyUserById');
    getThirdPartyUserByIdStub.withArgs(userId).resolves({ userId: userId });

    const thirdPartySubscriptionUpdateStub = sinon.stub(
        ThirdPartyService.prototype,
        'handleThirdPartySubscriptionUpdate'
    );
    thirdPartySubscriptionUpdateStub.withArgs(userId, ['LIST_A', 'LIST_B'], 'CHANNEL_A').resolves();

    expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

    beforeAll(async () => {
        await request(app)
            .post(PAGE_URL)
            .send({
                userId: userId,
                channel: 'CHANNEL_A',
                'list-selections[]': ['LIST_A', 'LIST_B'],
            })
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display summary title', () => {
        const panelHeader = htmlRes.getElementsByClassName(summaryHeadingPanelClass);
        expect(panelHeader[0].innerHTML).contains('Third Party Subscriptions Updated', 'Could not find the header');
    });

    it('should display summary body', () => {
        const panelBody = htmlRes.getElementsByClassName(summaryBodyPanelClass);
        expect(panelBody[0].innerHTML).contains(
            'Third party subscriptions for the user have been successfully updated',
            'Could not find the summary body'
        );
    });

    it('should display paragraph part 1', () => {
        const paragraph = htmlRes.getElementsByClassName(paragraphClass);
        expect(paragraph[0].innerHTML).contains(
            'To manage further subscriptions for third parties, you can go to: ',
            'Could not find paragraph part 1'
        );
    });

    it('should display manage third party text', () => {
        const paragraph = htmlRes.getElementsByClassName(paragraphClass);
        const anchor = paragraph[0].getElementsByTagName(anchorTag);
        expect(anchor[0].innerHTML).contains('Manage Third Party Users', 'Manage Users link text incorrect');
    });

    it('should display manage third party link', () => {
        const paragraph = htmlRes.getElementsByClassName(paragraphClass);
        const anchor = paragraph[0].getElementsByTagName(anchorTag)[0].getAttribute('href');
        expect(anchor).to.equal('/manage-third-party-users', 'Manage Users link is incorrect');
    });

    it('should display paragraph part 2', () => {
        const paragraph = htmlRes.getElementsByClassName(paragraphClass);
        expect(paragraph[0].innerHTML).contains(
            'To manage further subscriptions for third parties, you can go to: ',
            'Manage Third Party Users'
        );
    });
});
