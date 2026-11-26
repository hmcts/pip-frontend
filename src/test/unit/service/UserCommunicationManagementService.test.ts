import { expect } from 'chai';
import { UserCommunicationManagementService } from '../../../main/service/UserCommunicationManagementService';
import { UserCommunicationRequests } from '../../../main/resources/requests/UserCommunicationRequests';
import sinon from 'sinon';

const userCommunicationManagementService = new UserCommunicationManagementService();

describe('User communication management service', () => {
    describe('formatUserCommunicationPayload', () => {
        it('should format payload correctly and preserve audience data', () => {
            const formData = {
                userCommunicationId: '123',
                bannerMessage: 'message',
                bannerMessageWelsh: 'welshMessage',
                typeOfCommunication: 'VENUE',
                venues: ['venue1', 'venue2'],
                userProvenances: ['prov1'],
                userRoles: ['role1'],
                subJurisdictions: ['jur1'],
            };

            const result = userCommunicationManagementService['formatUserCommunicationPayload'](formData);
            expect(result.id).to.equal(formData.userCommunicationId);
            expect(result.message).to.equal(formData.bannerMessage);
            expect(result.welshMessage).to.equal(formData.bannerMessageWelsh);
            expect(result.audienceType).to.equal(formData.typeOfCommunication);
            expect(result.venues).to.deep.equal(formData.venues, 'Venues should be preserved');
            expect(result.userProvenances).to.deep.equal(formData.userProvenances, 'User provenances should be preserved');
            expect(result.userRoles).to.deep.equal(formData.userRoles, 'User roles should be preserved');
            expect(result.subJurisdictions).to.deep.equal(formData.subJurisdictions, 'Sub jurisdictions should be preserved');
        });

        it('should default audience data to empty arrays if missing', () => {
             const formData = {
                bannerMessage: 'message',
                bannerMessageWelsh: 'welshMessage',
                typeOfCommunication: 'ALL_USERS',
            };

            const result = userCommunicationManagementService['formatUserCommunicationPayload'](formData);
            expect(result.venues).to.deep.equal([]);
            expect(result.userProvenances).to.deep.equal([]);
            expect(result.userRoles).to.deep.equal([]);
            expect(result.subJurisdictions).to.deep.equal([]);
        });
    });

    describe('getFormDataById', () => {
        it('should return formatted form data when id exists', async () => {
            const userCommunication = {
                id: '123',
                message: 'test message',
                welshMessage: 'welsh test message',
                audienceType: 'ALL_USERS',
                userProvenances: [],
                userRoles: [],
                venues: [],
                subJurisdictions: [],
            };
            const getByIdStub = sinon.stub(UserCommunicationRequests.prototype, 'getUserCommunicationById').resolves(userCommunication);

            const result = await userCommunicationManagementService.getFormDataById('123', 'adminId');
            expect(result.userCommunicationId).to.equal('123');
            expect(result.bannerMessage).to.equal('test message');
            expect(result.bannerMessageWelsh).to.equal('welsh test message');
            expect(result.typeOfCommunication).to.equal('ALL_USERS');
            expect(getByIdStub.calledWith('123', 'adminId')).to.be.true;
            getByIdStub.restore();
        });

        it('should return empty object when id does not exist', async () => {
            const getByIdStub = sinon.stub(UserCommunicationRequests.prototype, 'getUserCommunicationById').resolves(null);

            const result = await userCommunicationManagementService.getFormDataById('invalid', 'adminId');
            expect(result).to.deep.equal({});
            getByIdStub.restore();
        });
    });

    describe('fetchUserCommunicationSummary', () => {
        const formData = {
            bannerMessage: 'message',
            bannerMessageWelsh: 'welshMessage',
            typeOfCommunication: 'ALL_USERS',
        };

        it('should return create edit link when no ID in formData', () => {
            const result = userCommunicationManagementService.fetchUserCommunicationSummary(formData, 'en');
            expect(result[0][3].html).to.contain('/create-user-communication');
        });

        it('should return edit edit link when ID is present in formData', () => {
            const formDataWithId = {
                ...formData,
                userCommunicationId: '123',
            };
            const result = userCommunicationManagementService.fetchUserCommunicationSummary(formDataWithId, 'en');
            expect(result[0][3].html).to.contain('/edit-user-communication?id=123');
        });
    });

    describe('deleteUserCommunication', () => {
        it('should call deleteUserCommunication and return true', async () => {
            const deleteStub = sinon.stub(UserCommunicationRequests.prototype, 'deleteUserCommunication').resolves(true);
            const result = await userCommunicationManagementService.deleteUserCommunication('123', 'adminId');
            expect(result).to.be.true;
            expect(deleteStub.calledWith('123', 'adminId')).to.be.true;
            deleteStub.restore();
        });

        it('should call deleteUserCommunication and return false', async () => {
            const deleteStub = sinon.stub(UserCommunicationRequests.prototype, 'deleteUserCommunication').resolves(false);
            const result = await userCommunicationManagementService.deleteUserCommunication('123', 'adminId');
            expect(result).to.be.false;
            expect(deleteStub.calledWith('123', 'adminId')).to.be.true;
            deleteStub.restore();
        });
    });
});
