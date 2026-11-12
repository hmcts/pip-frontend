import { expect } from 'chai';
import sinon from 'sinon';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';
import { UserCommunicationService } from '../../../main/service/UserCommunicationService';

const userCommunications = [
    {
        audienceType: 'ALL_USERS',
        message: 'test message 1',
        welshMessage: '',
    },
    {
        audienceType: 'USER_ROLE',
        userRoles: ['VERIFIED'],
        message: 'test message 2',
        welshMessage: 'Welsh test message 2',
    },
    {
        audienceType: 'VENUE',
        venues: [1, 2],
        message: 'test message 3',
        welshMessage: 'Welsh test message 3',
    },
    {
        audienceType: 'VENUE',
        venues: [3],
        message: 'test message 4',
        welshMessage: '',
    },
];
sinon.stub(AccountManagementRequests.prototype, 'getUserCommunications').resolves(userCommunications);

const userCommunicationService = new UserCommunicationService();

describe('User communication service', () => {
    it('should return grouped user communications', async () => {
        const result = await userCommunicationService.groupCommunicationMessages();
        expect(result.allUsersType).to.have.length(1);
        expect(result.userProvenanceType).to.be.empty;
        expect(result.userRoleType).to.have.length(1);
        expect(result.userRoleType[0].roles).to.contain('VERIFIED');
        expect(result.venueType).to.have.length(2);
        expect(result.jurisdictionType).to.be.empty;
    });

    it('should return user communication messages in English', async () => {
        const result = await userCommunicationService.groupCommunicationMessages();
        expect(result.allUsersType[0].message).to.equal('test message 1');
        expect(result.userRoleType[0].message).to.equal('test message 2');
        expect(result.venueType[0].message).to.equal('test message 3');
        expect(result.venueType[1].message).to.equal('test message 4');
    });

    it('should return Welsh user communication messages if present', async () => {
        const result = await userCommunicationService.groupCommunicationMessages();
        expect(result.allUsersType[0].welshMessage).to.equal('test message 1');
        expect(result.userRoleType[0].welshMessage).to.equal('Welsh test message 2');
        expect(result.venueType[0].welshMessage).to.equal('Welsh test message 3');
        expect(result.venueType[1].welshMessage).to.equal('test message 4');
    });
});
