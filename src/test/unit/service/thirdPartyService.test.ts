import { expect } from 'chai';
import { ThirdPartyService } from '../../../main/service/thirdPartyService';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';
import sinon from 'sinon';
import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';
import { SubscriptionService } from '../../../main/service/subscriptionService';

const thirdPartyService = new ThirdPartyService();

describe('Third Party Service tests', () => {
    const subscribeStub = sinon.stub(SubscriptionRequests.prototype, 'subscribe');
    const getSubscriptionsStub = sinon.stub(SubscriptionService.prototype, 'getSubscriptionsByUser');

    const adminUserId = '1234-1234';

    describe('generateListTypes', () => {
        const listTypes = new Map([
            [
                'LIST_A',
                {
                    friendlyName: 'List A',
                },
            ],
            [
                'LIST_B',
                {
                    friendlyName: 'List B',
                },
            ],
        ]);

        const subscriptions = {
            listTypeSubscriptions: [
                {
                    listType: 'LIST_B',
                },
            ],
        };

        const generatedListTypes = thirdPartyService.generateListTypes(listTypes, subscriptions);

        expect(Object.keys(generatedListTypes).length).equals(2, 'Number of list types does not match expected types');

        expect(generatedListTypes['LIST_A'].listFriendlyName).equals('List A', 'List Friendly Name is not as expected');

        expect(generatedListTypes['LIST_A'].checked).equals(false, 'Checked property not as expected');

        expect(generatedListTypes['LIST_B'].checked).equals(true, 'Checked property not as expected');
    });

    describe('getThirdPartyAccounts', () => {
        const thirdPartyAccounts = [
            {
                userId: '1234-1234',
                provenanceUserId: 'ThisIsAName',
                roles: 'GENERAL_THIRD_PARTY',
                createdDate: '2022-11-20T20:20:45.001Z',
            },
            {
                userId: '2345-2345',
                provenanceUserId: 'ThisIsAnotherName',
                roles: 'GENERAL_THIRD_PARTY',
                createdDate: '2022-11-20T20:20:45.001Z',
            },
        ];

        const getThirdPartyAccountsStub = sinon.stub(AccountManagementRequests.prototype, 'getThirdPartyAccounts');
        getThirdPartyAccountsStub.resolves(thirdPartyAccounts);

        it('should return correct number and details of third party objects', async () => {
            const data = await thirdPartyService.getThirdPartyAccounts(adminUserId);
            expect(data.length).to.equal(2, 'Number of accounts returned does not match expected length');

            const firstAccount = data[0];

            expect(firstAccount['userId']).to.equal('1234-1234', 'User ID does not match expected ID');
            expect(firstAccount['provenanceUserId']).to.equal(
                'ThisIsAName',
                'Provenance User ID does not match expected ID'
            );
            expect(firstAccount['roles']).to.equal('GENERAL_THIRD_PARTY', 'Users role does not match expected role');
            expect(firstAccount['createdDate']).to.equal(
                '20 November 2022',
                'Created date does not match expected date'
            );
        });
    });

    describe('generateAvailableChannels', () => {
        it('should return correct checked options when existing subscription', () => {
            const subscriptionChannels = ['CHANNEL_A', 'CHANNEL_B'];
            const subscriptions = {
                listTypeSubscriptions: [{ channel: 'CHANNEL_A' }],
            };

            const channels = thirdPartyService.generateAvailableChannels(subscriptionChannels, subscriptions);

            expect(channels.length).to.equal(2, 'Unexpected number of channels returned');
            expect(channels[0].value).to.equal('CHANNEL_A', 'Unexpected channel value returned');
            expect(channels[0].text).to.equal('CHANNEL_A', 'Unexpected channel text returned');
            expect(channels[0].checked).to.equal(true, 'Unexpected checked value returned');
            expect(channels[1].checked).to.equal(false, 'Unexpected checked value returned');
        });

        it('should return correct checked options when only one channel', () => {
            const subscriptionChannels = ['CHANNEL_A'];
            const subscriptions = { listTypeSubscriptions: [] };

            const channels = thirdPartyService.generateAvailableChannels(subscriptionChannels, subscriptions);

            expect(channels.length).to.equal(1, 'Unexpected number of channels returned');
            expect(channels[0].checked).to.equal(true, 'Unexpected checked value returned');
        });

        it('should return correct checked options when no existing subscriptions', () => {
            const subscriptionChannels = ['CHANNEL_A', 'CHANNEL_B'];
            const subscriptions = { listTypeSubscriptions: [] };

            const channels = thirdPartyService.generateAvailableChannels(subscriptionChannels, subscriptions);

            expect(channels.length).to.equal(2, 'Unexpected number of channels returned');
            expect(channels[0].checked).to.equal(true, 'Unexpected checked value returned');
            expect(channels[1].checked).to.equal(false, 'Unexpected checked value returned');
        });
    });

    describe('create third party subscription', () => {
        subscribeStub.resolves();

        it('check a subscription is created', () => {
            const userId = '1234-1234';
            const listType = 'LIST_TYPE';
            const channel = 'CHANNEL_A';

            thirdPartyService.createdThirdPartySubscription(adminUserId, userId, listType, channel);

            expect(
                subscribeStub.calledOnceWith({
                    channel: channel,
                    searchType: 'LIST_TYPE',
                    searchValue: listType,
                    userId: userId,
                })
            ).to.equal(true, 'Subscribe not called with expected arguments');
        });
    });

    describe('get third party by user ID', () => {
        const userId = '1234-1234';
        const getUserStub = sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId');

        it('check user is returned', async () => {
            getUserStub.resolves({
                userId: userId,
                createdDate: '2022-11-18T14:00:00Z',
                userProvenance: 'THIRD_PARTY',
            });

            const returnedUser = await thirdPartyService.getThirdPartyUserById(userId, '1234-1234');

            expect(returnedUser['userId']).to.equal(userId, 'User ID not as expected');
            expect(returnedUser['createdDate']).to.equal('18 November 2022', 'Formatted date not as expected');
            expect(returnedUser['userProvenance']).to.equal('THIRD_PARTY', 'User provenance not as expected');
        });

        it('check user returned is null if no user found', async () => {
            getUserStub.resolves(null);

            const returnedUser = await thirdPartyService.getThirdPartyUserById(userId, adminUserId);

            expect(returnedUser).to.equal(null, 'User returned should be null');
        });

        it('check user returned is null if not third party ', async () => {
            getUserStub.resolves({
                userId: userId,
                createdDate: '2022-11-18T14:00:00Z',
                userProvenance: 'PI_AAD',
            });

            const returnedUser = await thirdPartyService.getThirdPartyUserById(userId, adminUserId);

            expect(returnedUser).to.equal(null, 'User returned should be null');
        });
    });

    describe('handle third party subscription update', () => {
        const userId = '1234-1234';

        it('check that subscribe is called for a brand new subscription', async () => {
            const selectedUser = userId;
            const selectedListTypes = ['LIST_A'];
            const selectedChannel = 'CHANNEL_A';

            getSubscriptionsStub.withArgs(userId).resolves({ listTypeSubscriptions: [] });

            const subscribeArgs = {
                channel: 'CHANNEL_A',
                searchType: 'LIST_TYPE',
                searchValue: 'LIST_A',
                userId: userId,
            };

            await thirdPartyService.handleThirdPartySubscriptionUpdate(
                adminUserId,
                selectedUser,
                selectedListTypes,
                selectedChannel
            );

            expect(subscribeStub.calledWith(subscribeArgs)).to.equal(true);
        });

        it('check that subscribe is called if channel differs', async () => {
            const selectedUser = userId;
            const selectedListTypes = ['LIST_A'];
            const selectedChannel = 'CHANNEL_D';

            getSubscriptionsStub.withArgs(userId).resolves({
                listTypeSubscriptions: [{ listType: 'LIST_A', channel: 'CHANNEL_B' }],
            });

            const subscribeArgs = {
                channel: 'CHANNEL_D',
                searchType: 'LIST_TYPE',
                searchValue: 'LIST_A',
                userId: userId,
            };

            await thirdPartyService.handleThirdPartySubscriptionUpdate(
                adminUserId,
                selectedUser,
                selectedListTypes,
                selectedChannel
            );

            expect(subscribeStub.calledWith(subscribeArgs)).to.equal(true);
        });

        it('check that unsubscribe is called if no longer selected', async () => {
            const selectedUser = userId;
            const selectedListTypes = ['LIST_B'];
            const selectedChannel = 'CHANNEL_D';

            getSubscriptionsStub.withArgs(userId).resolves({
                listTypeSubscriptions: [{ listType: 'LIST_A', channel: 'CHANNEL_B', subscriptionId: '2345' }],
            });

            const unsubscribeStub = sinon.stub(SubscriptionService.prototype, 'unsubscribe');

            await thirdPartyService.handleThirdPartySubscriptionUpdate(
                adminUserId,
                selectedUser,
                selectedListTypes,
                selectedChannel
            );

            expect(unsubscribeStub.calledWith('2345')).to.equal(true);
        });
    });
});
