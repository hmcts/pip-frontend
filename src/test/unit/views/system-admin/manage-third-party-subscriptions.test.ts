import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import { ThirdPartyService } from '../../../../main/service/ThirdPartyService';
import sinon from 'sinon';

const userId = '123';
const userId2 = '124';
const PAGE_URL = '/manage-third-party-subscriptions';

const thirdPartySubscriptions = [
    {
        userId: userId,
        listType: 'CIVIL_DAILY_CAUSE_LIST',
        sensitivity: 'PUBLIC',
    },
    {
        userId: userId,
        listType: 'FAMILY_DAILY_CAUSE_LIST',
        sensitivity: 'PRIVATE',
    },
    {
        userId: userId,
        listType: 'SJP_PRESS_LIST',
        sensitivity: 'CLASSIFIED',
    },
];

const getThirdPartySubscriptionsStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscriptionsByUserId');
getThirdPartySubscriptionsStub.withArgs(userId).resolves(thirdPartySubscriptions);
getThirdPartySubscriptionsStub.withArgs(userId2).resolves([]);

app.request['user'] = {
    roles: 'SYSTEM_ADMIN',
};

let htmlRes: Document;

describe('Manage third party subscriptions', () => {
    describe('with existing subscriptions', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL + `?userId=${userId}`)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains('Manage third-party subscriptions');
        });

        it('should display page header', () => {
            const header = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(header[0].innerHTML).contains('Manage third-party subscriptions');
        });

        it('should display select list type message', () => {
            const body = htmlRes.getElementsByClassName('govuk-body');
            expect(body[0].innerHTML).contains(
                'To subscribe to publications of a list type, please select a sensitivity level for the list type below.'
            );
        });

        it('should display correct table headers', () => {
            const tableHeader = htmlRes.getElementsByClassName('govuk-table__header');
            expect(tableHeader[0].innerHTML).contains('List type');
            expect(tableHeader[1].innerHTML).contains('Sensitivity');
        });

        it('should display the correct list type names on table cells', () => {
            expect(htmlRes.getElementById('CIVIL_DAILY_CAUSE_LIST-name').innerHTML).contains('Civil Daily Cause List');
            expect(htmlRes.getElementById('FAMILY_DAILY_CAUSE_LIST-name').innerHTML).contains(
                'Family Daily Cause List'
            );
            expect(htmlRes.getElementById('SJP_PRESS_LIST-name').innerHTML).contains(
                'Single Justice Procedure Press List (Full List)'
            );
        });

        it('should display the correct list type sensitivities on table cells', () => {
            expect(htmlRes.getElementById('CIVIL_DAILY_CAUSE_LIST-sensitivity').innerHTML).contains(
                'option value="Public" selected'
            );
            expect(htmlRes.getElementById('CIVIL_DAILY_CAUSE_LIST-sensitivity').innerHTML).not.contains(
                'option value="Private" selected'
            );
            expect(htmlRes.getElementById('CIVIL_DAILY_CAUSE_LIST-sensitivity').innerHTML).not.contains(
                'option value="Classified" selected'
            );
            expect(htmlRes.getElementById('FAMILY_DAILY_CAUSE_LIST-sensitivity').innerHTML).not.contains(
                'option value="Public" selected'
            );
            expect(htmlRes.getElementById('FAMILY_DAILY_CAUSE_LIST-sensitivity').innerHTML).contains(
                'option value="Private" selected'
            );
            expect(htmlRes.getElementById('FAMILY_DAILY_CAUSE_LIST-sensitivity').innerHTML).not.contains(
                'option value="Classified" selected'
            );
            expect(htmlRes.getElementById('SJP_PRESS_LIST-sensitivity').innerHTML).not.contains(
                'option value="Public" selected'
            );
            expect(htmlRes.getElementById('SJP_PRESS_LIST-sensitivity').innerHTML).not.contains(
                'option value="Private" selected'
            );
            expect(htmlRes.getElementById('SJP_PRESS_LIST-sensitivity').innerHTML).contains(
                'option value="Classified" selected'
            );
            expect(htmlRes.getElementById('SJP_PUBLIC_LIST-sensitivity').innerHTML).not.contains(
                'option value="Public" selected'
            );
            expect(htmlRes.getElementById('SJP_PUBLIC_LIST-sensitivity').innerHTML).not.contains(
                'option value="Private" selected'
            );
            expect(htmlRes.getElementById('SJP_PUBLIC_LIST-sensitivity').innerHTML).not.contains(
                'option value="Classified" selected'
            );
        });

        it('should display the correct dropdown options', () => {
            const dropdowns = htmlRes
                .getElementsByClassName('govuk-table__cell')[1]
                .getElementsByClassName('govuk-select');

            expect(dropdowns[0].innerHTML)
                .contains('Not selected')
                .contains('Public')
                .contains('Private')
                .contains('Classified');
        });

        it('should display the update button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button');
            expect(button[0].innerHTML).contains('Update');
        });
    });

    describe('without existing subscriptions', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL + `?userId=${userId2}`)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display the create button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button');
            expect(button[0].innerHTML).contains('Create');
        });
    });
});
