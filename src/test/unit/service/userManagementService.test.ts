import { expect } from 'chai';
import sinon from 'sinon';
import { UserManagementService } from '../../../main/service/userManagementService';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';
import { UserSearchCriteria } from '../../../main/models/UserSearchCriteria';

const userManagementService = new UserManagementService();

const testReqBody = {
    email: 'test',
    userId: '',
    userProvenanceId: '',
    roles: ['VERIFIED', 'INTERNAL_ADMIN_CTSC'],
    provenances: 'PI_AAD',
};

const testManageUserSummaryAdmin = {
    userId: 'c4201452-2c4d-4389-a104-b1f078647349',
    userProvenance: 'PI_AAD',
    provenanceUserId: '4dcea424-03ed-43d6-88b8-a99ce8159da2',
    email: 'test@email.com',
    roles: 'INTERNAL_SUPER_ADMIN_CTSC',
    createdDate: '2022-11-05T18:45:37.720216',
    lastSignedInDate: '2022-11-07T18:45:37.720216',
};

const testManageUserSummaryMedia = {
    userId: 'c4201452-2c4d-4389-a104-b1f078647349',
    userProvenance: 'PI_AAD',
    provenanceUserId: '4dcea424-03ed-43d6-88b8-a99ce8159da2',
    email: 'test@email.com',
    roles: 'VERIFIED',
    createdDate: '2022-11-05T18:45:37.720216',
    lastVerifiedDate: '2022-11-07T18:45:37.720216',
};

const testApiResponseData = {
    content: [
        {
            userId: '158f4249-a763-4a4a-866c-8e0dd5b3bdaf',
            userProvenance: 'PI_AAD',
            provenanceUserId: '7f84093e-4340-40b2-b693-fc6e8ce4d8e2',
            email: 'test1@email.com',
            roles: 'VERIFIED',
            createdDate: '2022-01-31T14:23:35.056402',
            lastVerifiedDate: '2022-09-26T05:10:11.407927',
            lastSignedInDate: '2022-04-05T14:43:19.613239',
        },
        {
            userId: '309b7fbe-65be-45d3-8aee-5e3b59f2da6g',
            userProvenance: 'PI_AAD',
            provenanceUserId: '768633fb-8f5f-4a6b-9d72-0d5ed4622bbo',
            email: 'test2@email.com',
            roles: 'INTERNAL_ADMIN_LOCAL',
            createdDate: '2022-10-13T12:47:05.866678',
            lastVerifiedDate: '2022-10-13T12:47:05.862886',
            lastSignedInDate: '2022-10-20T16:32:55.026',
        },
        {
            userId: '240cd401-5829-4383-95e9-912feb0a3cf0',
            userProvenance: 'PI_AAD',
            provenanceUserId: '83daa9bf-3e96-47bd-8c31-46a3e9801450',
            email: 'test3@email.com',
            roles: 'SYSTEM_ADMIN',
            createdDate: '2022-10-13T12:47:05.866678',
            lastVerifiedDate: '2022-10-13T12:47:05.866678',
            lastSignedInDate: '2022-11-19T10:58:02.746',
        },
        {
            userId: '66a37f65-9813-49d9-be88-301f0b7b6840',
            userProvenance: 'PI_AAD',
            provenanceUserId: '1a960345-1057-47a6-929d-378d7f712a36',
            email: 'test4@email.com',
            roles: 'VERIFIED',
            createdDate: '2022-03-05T17:07:22.87176',
            lastVerifiedDate: '2022-02-15T09:47:42.784288',
            lastSignedInDate: '2022-06-11T23:53:29.645226',
        },
        {
            userId: '4dd14e00-0531-43e2-a443-7f25a85fcdd6',
            userProvenance: 'PI_AAD',
            provenanceUserId: '914ecfce-9033-4b99-9243-c471c1260860',
            email: 'test5@email.com',
            roles: 'VERIFIED',
            createdDate: '2022-09-03T09:27:25.289474',
            lastVerifiedDate: '2022-07-04T01:39:28.887728',
            lastSignedInDate: '2022-08-08T04:26:11.784896',
        },
    ],
    pageable: {
        sort: { empty: true, unsorted: true, sorted: false },
        offset: 5,
        pageNumber: 1,
        pageSize: 5,
        unpaged: false,
        paged: true,
    },
    last: false,
    totalPages: 10,
    totalElements: 50,
    first: false,
    number: 1,
    size: 5,
    sort: { empty: true, unsorted: true, sorted: false },
    numberOfElements: 5,
    empty: false,
};

sinon.stub(AccountManagementRequests.prototype, 'getAllAccountsExceptThirdParty').resolves(testApiResponseData);

describe('User management service', () => {
    it('should return the correct table headers', () => {
        const response = userManagementService.getTableHeaders();

        expect(response[0].text).to.equal('Email');
        expect(response[0].classes).to.equal('govuk-!-padding-top-0');
        expect(response[1].text).to.equal('Role');
        expect(response[1].classes).to.equal('govuk-!-padding-top-0');
        expect(response[2].text).to.equal('Provenance');
        expect(response[2].classes).to.equal('govuk-!-padding-top-0');
        expect(response[3].text).to.equal('');
        expect(response[3].classes).to.equal('govuk-!-padding-top-0');
    });

    it('should build user update select box', () => {
        const response = userManagementService.buildUserUpdateSelectBox('SYSTEM_ADMIN');

        expect(response[0].value).to.equal('INTERNAL_ADMIN_CTSC');
        expect(response[0].text).to.equal('CTSC Admin');
        expect(response[0].selected).to.equal(false);
    });

    it('should generate the filter key values', () => {
        // Have to parse JSON in this way to fully replicate req.body
        const response = userManagementService.generateFilterKeyValues(JSON.parse(JSON.stringify(testReqBody)));

        expect(response).to.contain('email=test');
        expect(response).to.contain('&roles=VERIFIED,INTERNAL_ADMIN_CTSC');
        expect(response).to.contain('&provenances=PI_AAD');
    });

    it('should build the manage user summary list for an admin user', () => {
        const response = userManagementService.buildManageUserSummaryList(testManageUserSummaryAdmin);

        expect(response['rows'][0]['key']['text']).to.contain('User ID');
        expect(response['rows'][0]['value']['text']).to.contain(testManageUserSummaryAdmin.userId);
        expect(response['rows'][1]['key']['text']).to.contain('Email');
        expect(response['rows'][1]['value']['text']).to.contain(testManageUserSummaryAdmin.email);
        expect(response['rows'][2]['key']['text']).to.contain('Role');
        expect(response['rows'][2]['value']['text']).to.contain('CTSC Super Admin');
        expect(response['rows'][2]['actions']['items'][0]['href']).to.contain(
            '/update-user?id=' + testManageUserSummaryAdmin.userId
        );
        expect(response['rows'][3]['key']['text']).to.contain('Provenance');
        expect(response['rows'][3]['value']['text']).to.contain('B2C');
        expect(response['rows'][4]['key']['text']).to.contain('Provenance ID');
        expect(response['rows'][4]['value']['text']).to.contain(testManageUserSummaryAdmin.provenanceUserId);
        expect(response['rows'][5]['key']['text']).to.contain('Creation Date');
        expect(response['rows'][5]['value']['text']).to.contain('05/11/2022 18:45:37');
        expect(response['rows'][6]['key']['text']).to.contain('Last Sign In');
        expect(response['rows'][6]['value']['text']).to.contain('07/11/2022 18:45:37');
    });

    it('should build the manage user summary list for a media user', () => {
        const response = userManagementService.buildManageUserSummaryList(testManageUserSummaryMedia);

        expect(response['rows'][0]['key']['text']).to.contain('User ID');
        expect(response['rows'][0]['value']['text']).to.contain(testManageUserSummaryMedia.userId);
        expect(response['rows'][1]['key']['text']).to.contain('Email');
        expect(response['rows'][1]['value']['text']).to.contain(testManageUserSummaryMedia.email);
        expect(response['rows'][2]['key']['text']).to.contain('Role');
        expect(response['rows'][2]['value']['text']).to.contain('Verified');
        expect(response['rows'][3]['key']['text']).to.contain('Provenance');
        expect(response['rows'][3]['value']['text']).to.contain('B2C');
        expect(response['rows'][4]['key']['text']).to.contain('Provenance ID');
        expect(response['rows'][4]['value']['text']).to.contain(testManageUserSummaryMedia.provenanceUserId);
        expect(response['rows'][5]['key']['text']).to.contain('Creation Date');
        expect(response['rows'][5]['value']['text']).to.contain('05/11/2022 18:45:37');
        expect(response['rows'][6]['key']['text']).to.contain('Last Verified');
        expect(response['rows'][6]['value']['text']).to.contain('07/11/2022 18:45:37');
    });

    it('should handle filter clearing of role', () => {
        const testClear = {
            roles: 'INTERNAL_ADMIN_LOCAL,INTERNAL_SUPER_ADMIN_LOCAL,SYSTEM_ADMIN',
            clear: 'roles=SYSTEM_ADMIN',
        };

        const testClearResponse = {
            roles: ['INTERNAL_ADMIN_LOCAL', 'INTERNAL_SUPER_ADMIN_LOCAL'],
        };

        const response = userManagementService.handleFilterClearing(testClear);
        expect(response).to.eql(testClearResponse);
    });

    it('should handle filter clearing of provenance', () => {
        const testClear = {
            provenances: 'PI_AAD,CFT_IDAM',
            clear: 'provenances=PI_AAD',
        };

        const testClearResponse = {
            provenances: ['CFT_IDAM'],
        };

        const response = userManagementService.handleFilterClearing(testClear);
        expect(response).to.eql(testClearResponse);
    });

    it('should handle filter clearing of email', () => {
        const testClear = {
            email: 'test@email.com',
            clear: 'email=test@email.com',
        };
        const testClearResponse = {};

        const response = userManagementService.handleFilterClearing(testClear);
        expect(response).to.eql(testClearResponse);
    });

    it('should handle filter clearing of user id', () => {
        const testClear = {
            userId: '1234',
            clear: 'userId=1234',
        };
        const testClearResponse = {};

        const response = userManagementService.handleFilterClearing(testClear);
        expect(response).to.eql(testClearResponse);
    });

    it('should handle filter clearing of user provenance id', () => {
        const testClear = {
            userProvenanceId: '1234',
            clear: 'userProvenanceId=1234',
        };
        const testClearResponse = {};

        const response = userManagementService.handleFilterClearing(testClear);
        expect(response).to.eql(testClearResponse);
    });

    it('should handle filter clearing all', () => {
        const response = userManagementService.handleFilterClearing({
            clear: 'all',
        });
        expect(response).to.be.empty;
    });

    it('should return formatted data from the getFormattedData function', async () => {
        const userSearchCriteria = new UserSearchCriteria(1, 'test', '', '', 'SYSTEM_ADMIN', 'PI_AAD');

        const response = await userManagementService.getFormattedData(userSearchCriteria, '?page=2', {
            userId: '1234',
            email: 'test@justice.gov.uk',
        });

        // Pagination data
        expect(response['paginationData']['previous'].labelText).to.equal('1 of 10');
        expect(response['paginationData']['previous'].href).to.equal('?page=1');
        expect(response['paginationData']['next'].labelText).to.equal('3 of 10');
        expect(response['paginationData']['next'].href).to.equal('?page=3');

        // User data
        expect(response['userData'][0][0].text).to.equal('test1@email.com');
        expect(response['userData'][0][1].text).to.equal('Verified');
        expect(response['userData'][0][2].text).to.equal('B2C');
        expect(response['userData'][0][3].html).to.equal(
            '<a class="govuk-link" id="manage-link" ' +
                'href="manage-user?id=158f4249-a763-4a4a-866c-8e0dd5b3bdaf">Manage</a>'
        );

        // Check field data exists
        expect(response['emailFieldData']).to.exist;
        expect(response['userIdFieldData']).to.exist;
        expect(response['userProvenanceIdFieldData']).to.exist;
        expect(response['rolesFieldData']).to.exist;
        expect(response['provenancesFieldData']).to.exist;
    });
});
