import { expect } from 'chai';
import { ThirdPartyService } from '../../../main/service/ThirdPartyService';
import sinon from 'sinon';
import { ThirdPartyRequests } from '../../../main/resources/requests/ThirdPartyRequests';

const thirdPartyService = new ThirdPartyService();

describe('Third Party Service tests', () => {
    const adminUserId = '1234-1234';
    const userId = '123';
    const invalidUserId = '124';

    const subscriptionFormData = {
        CIVIL_DAILY_CAUSE_LIST: 'PUBLIC',
        FAMILY_DAILY_CAUSE_LIST: 'PRIVATE',
        SJP_PRESS_LIST: 'CLASSIFIED',
    };

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

    describe('getThirdPartySubscribers', () => {
        const thirdPartySubscribers = [
            {
                userId: '1234-1234',
                name: 'ThisIsAName',
                createdDate: '2022-11-20T20:20:45.001Z',
            },
            {
                userId: '2345-2345',
                name: 'ThisIsAnotherName',
                createdDate: '2022-11-20T20:20:45.001Z',
            },
        ];

        const getThirdPartySubscribersStub = sinon.stub(ThirdPartyRequests.prototype, 'getThirdPartySubscribers');
        getThirdPartySubscribersStub.resolves(thirdPartySubscribers);

        it('should return correct number and details of third-party subscribers', async () => {
            const data = await thirdPartyService.getThirdPartySubscribers(adminUserId);
            expect(data.length).to.equal(2, 'Number of accounts returned does not match expected length');

            const firstAccount = data[0];

            expect(firstAccount['userId']).to.equal('1234-1234', 'User ID does not match expected ID');
            expect(firstAccount['name']).to.equal('ThisIsAName', 'Provenance User ID does not match expected ID');
            expect(firstAccount['createdDate']).to.equal(
                '20 November 2022',
                'Created date does not match expected date'
            );
        });
    });

    describe('get third party by subscriber ID', () => {
        const userId = '1234-1234';
        const getUserStub = sinon.stub(ThirdPartyRequests.prototype, 'getThirdPartySubscriberByUserId');

        it('check user is returned', async () => {
            getUserStub.resolves({
                userId: userId,
                createdDate: '2022-11-18T14:00:00Z',
            });

            const returnedUser = await thirdPartyService.getThirdPartySubscriberById(userId, '1234-1234');

            expect(returnedUser['userId']).to.equal(userId, 'User ID not as expected');
            expect(returnedUser['createdDate']).to.equal('18 November 2022', 'Formatted date not as expected');
        });

        it('check user returned is null if no user found', async () => {
            getUserStub.resolves(null);

            const returnedUser = await thirdPartyService.getThirdPartySubscriberById(userId, adminUserId);

            expect(returnedUser).to.equal(null, 'User returned should be null');
        });
    });

    describe('validateThirdPartySubscriberFormFields', () => {
        it('should return errors with no third-party subscriber name', () => {
            const result = thirdPartyService.validateThirdPartySubscriberFormFields({});
            expect(result.userNameError).to.be.true;
        });

        it('should return null when both third-party subscriber name', () => {
            const result = thirdPartyService.validateThirdPartySubscriberFormFields({
                thirdPartySubscriberName: 'name',
            });
            expect(result).to.be.null;
        });
    });

    describe('createThirdPartySubscriber', () => {
        const formData = {
            thirdPartySubscriberName: 'name',
        };

        const createThirdPartySubscriberStub = sinon.stub(ThirdPartyRequests.prototype, 'createThirdPartySubscriber');
        createThirdPartySubscriberStub.withArgs(sinon.match.any, '1').resolves(true);
        createThirdPartySubscriberStub.withArgs(sinon.match.any, '2').resolves(false);
        createThirdPartySubscriberStub.withArgs(sinon.match.any, '3').resolves(null);

        it('should return true if account management request return created third-party subscriber', async () => {
            const result = await thirdPartyService.createThirdPartySubscriber(formData, '1');
            expect(result).to.be.true;
        });

        it('should return false if account management request return errored third-party subscriber', async () => {
            const result = await thirdPartyService.createThirdPartySubscriber(formData, '2');
            expect(result).to.be.false;
        });

        it('should return false if account management request returns null', async () => {
            const result = await thirdPartyService.createThirdPartySubscriber(formData, '3');
            expect(result).to.be.null;
        });
    });

    describe('Create third-party subscriptions', () => {
        const createThirdPartySubscriptionsStub = sinon.stub(
            ThirdPartyRequests.prototype,
            'createThirdPartySubscriptions'
        );
        createThirdPartySubscriptionsStub.withArgs(sinon.match.any, userId).resolves(true);
        createThirdPartySubscriptionsStub.withArgs(sinon.match.any, invalidUserId).resolves(false);

        it('should return true if third-party subscriptions created', async () => {
            const result = await thirdPartyService.createThirdPartySubscriptions(subscriptionFormData, userId, userId);
            expect(result).to.be.true;
        });

        it('should return false if third-party subscription creation error', async () => {
            const result = await thirdPartyService.createThirdPartySubscriptions(
                subscriptionFormData,
                invalidUserId,
                invalidUserId
            );
            expect(result).to.be.false;
        });
    });

    describe('Update third-party subscriptions', () => {
        const updateThirdPartySubscriptionsStub = sinon.stub(
            ThirdPartyRequests.prototype,
            'updateThirdPartySubscriptions'
        );
        updateThirdPartySubscriptionsStub.withArgs(sinon.match.any, userId).resolves(true);
        updateThirdPartySubscriptionsStub.withArgs(sinon.match.any, invalidUserId).resolves(false);

        it('should return true if third-party subscriptions update', async () => {
            const result = await thirdPartyService.updateThirdPartySubscriptions(
                subscriptionFormData,
                userId,
                adminUserId
            );
            expect(result).to.be.true;
        });

        it('should return false if third-party subscription update error', async () => {
            const result = await thirdPartyService.updateThirdPartySubscriptions(
                subscriptionFormData,
                invalidUserId,
                adminUserId
            );
            expect(result).to.be.false;
        });
    });

    describe('Get third-party subscriptions by user ID', () => {
        const getThirdPartySubscriptionsStub = sinon.stub(
            ThirdPartyRequests.prototype,
            'getThirdPartySubscriptionsByUserId'
        );
        getThirdPartySubscriptionsStub.withArgs(userId).resolves(thirdPartySubscriptions);
        getThirdPartySubscriptionsStub.withArgs(invalidUserId).resolves(null);

        it('check user is returned', async () => {
            const result = await thirdPartyService.getThirdPartySubscriptionsByUserId(userId, adminUserId);
            expect(result).to.equal(thirdPartySubscriptions);
        });

        it('check user returned is null if no user found', async () => {
            const result = await thirdPartyService.getThirdPartySubscriptionsByUserId(invalidUserId, adminUserId);
            expect(result).to.be.null;
        });
    });

    describe('Construct list type to sensitivity mapping', () => {
        it('should return correct list type friendly names and sensitivity items', () => {
            const result = thirdPartyService.constructListTypeSensitivityMappings(thirdPartySubscriptions);

            const civilListResult = result.get('CIVIL_DAILY_CAUSE_LIST');
            expect(civilListResult.friendlyName).to.equal('Civil Daily Cause List');
            expect(civilListResult.sensitivityItems[1].selected).to.be.true;
            expect(civilListResult.sensitivityItems[2].selected).to.be.false;
            expect(civilListResult.sensitivityItems[3].selected).to.be.false;

            const familyListResult = result.get('FAMILY_DAILY_CAUSE_LIST');
            expect(familyListResult.friendlyName).to.equal('Family Daily Cause List');
            expect(familyListResult.sensitivityItems[1].selected).to.be.false;
            expect(familyListResult.sensitivityItems[2].selected).to.be.true;
            expect(familyListResult.sensitivityItems[3].selected).to.be.false;

            const sjpPressListResult = result.get('SJP_PRESS_LIST');
            expect(sjpPressListResult.friendlyName).to.equal('Single Justice Procedure Press List (Full List)');
            expect(sjpPressListResult.sensitivityItems[1].selected).to.be.false;
            expect(sjpPressListResult.sensitivityItems[2].selected).to.be.false;
            expect(sjpPressListResult.sensitivityItems[3].selected).to.be.true;
        });
    });

    describe('Replace list type keys with friendly names', () => {
        it('should return expected list type friendly names', () => {
            const result = thirdPartyService.replaceListTypeKeysWithFriendlyNames(subscriptionFormData);
            expect(result).to.have.length(3);

            const keys = Array.from(result.keys());
            expect(keys[0]).to.equal('Civil Daily Cause List');
            expect(keys[1]).to.equal('Family Daily Cause List');
            expect(keys[2]).to.equal('Single Justice Procedure Press List (Full List)');
        });
    });

    describe('createThirdPartySubscriberOauthConfig', () => {
        const formData = {
            userId: 'user',
            destinationUrl: 'destinationUrl',
            tokenUrl: 'tokenUrl',
        };

        const createThirdPartySubscriberOauthConfigStub = sinon.stub(
            ThirdPartyRequests.prototype,
            'createThirdPartySubscriberOauthConfig'
        );
        createThirdPartySubscriberOauthConfigStub.withArgs(sinon.match.any, '1').resolves(true);
        createThirdPartySubscriberOauthConfigStub.withArgs(sinon.match.any, '2').resolves(false);
        createThirdPartySubscriberOauthConfigStub.withArgs(sinon.match.any, '3').resolves(null);

        it('should return true if account management request return created third party oauth config for subscriber', async () => {
            const result = await thirdPartyService.createThirdPartySubscriberOauthConfig(formData, '1');
            expect(result).to.be.true;
        });

        it('should return false if account management request return errored third party oauth config for subscriber', async () => {
            const result = await thirdPartyService.createThirdPartySubscriberOauthConfig(formData, '2');
            expect(result).to.be.false;
        });

        it('should return false if account management request returns null', async () => {
            const result = await thirdPartyService.createThirdPartySubscriberOauthConfig(formData, '3');
            expect(result).to.be.null;
        });
    });

    describe('validateThirdPartySubscriberOauthConfigFormFields', () => {
        it('should return errors with no third-party subscriber name', () => {
            const result = thirdPartyService.validateThirdPartySubscriberOauthConfigFormFields({});
            expect(result.destinationUrlError).to.be.true;
        });

        it('should return null when both third-party subscriber name', () => {
            const result = thirdPartyService.validateThirdPartySubscriberOauthConfigFormFields({
                userId: 'user',
                destinationUrl: 'destinationUrl',
                tokenUrl: 'tokenUrl',
                clientId: 'clientId',
                clientSecret: 'clientSecret',
                scope: 'scope',
            });
            expect(result).to.be.null;
        });
    });
});
