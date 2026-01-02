import { expect } from 'chai';
import { ThirdPartyService } from '../../../main/service/ThirdPartyService';
import sinon from 'sinon';
import { ThirdPartyRequests } from '../../../main/resources/requests/ThirdPartyRequests';

const thirdPartyService = new ThirdPartyService();

describe('Third Party Service tests', () => {

    const adminUserId = '1234-1234';

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

        const getThirdPartySubscribersStub = sinon.stub(
            ThirdPartyRequests.prototype,
            'getThirdPartySubscribers'
        );
        getThirdPartySubscribersStub.resolves(thirdPartySubscribers);

        it('should return correct number and details of third party subscribers', async () => {
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
        it('should return errors with no third party subscriber name', () => {
            const result = thirdPartyService.validateThirdPartySubscriberFormFields({});
            expect(result.userNameError).to.be.true;
        });

        it('should return null when both third party subscriber name', () => {
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

        const createThirdPartySubscriberStub = sinon.stub(
            ThirdPartyRequests.prototype,
            'createThirdPartySubscriber'
        );
        createThirdPartySubscriberStub.withArgs(sinon.match.any, '1').resolves(true);
        createThirdPartySubscriberStub.withArgs(sinon.match.any, '2').resolves(false);
        createThirdPartySubscriberStub.withArgs(sinon.match.any, '3').resolves(null);

        it('should return true if account management request return created third party subscriber', async () => {
            const result = await thirdPartyService.createThirdPartySubscriber(formData, '1');
            expect(result).to.be.true;
        });

        it('should return false if account management request return errored third party subscriber', async () => {
            const result = await thirdPartyService.createThirdPartySubscriber(formData, '2');
            expect(result).to.be.false;
        });

        it('should return false if account management request returns null', async () => {
            const result = await thirdPartyService.createThirdPartySubscriber(formData, '3');
            expect(result).to.be.null;
        });
    });
});
