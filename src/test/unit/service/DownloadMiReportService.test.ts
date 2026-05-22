import { expect } from 'chai';
import sinon from 'sinon';
import ExcelJS from 'exceljs';
import { DownloadMiReportService } from '../../../main/service/DownloadMiReportService';
import { PublicationRequests } from '../../../main/resources/requests/PublicationRequests';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';
import { SubscriptionRequests } from '../../../main/resources/requests/SubscriptionRequests';

const downloadMiReportService = new DownloadMiReportService();

const accountMiData = [
    {
        userId: '1234',
        provenanceUserId: '11223344',
        userProvenance: 'PI_AAD',
        roles: 'VERIFIED',
        createdDate: '2022-11-18T14:00:00Z',
        lastSignedInDate: '2022-11-18T14:00:00Z',
    },
];

const publicationMiData = [
    {
        artefactId: '12345678',
        displayFrom: '2022-11-18T14:00:00Z',
        displayTo: '2022-11-20T14:00:00Z',
        language: 'ENGLISH',
        provenance: 'MANUAL_UPLOAD',
        sensitivity: 'PUBLIC',
        sourceArtefactId: '1234',
        supersededCount: '2',
        type: 'LIST',
        contentDate: '2022-11-18T14:00:00Z',
        locationId: '15',
        locationName: 'Court Name',
        listType: 'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
    },
];

const locationMiData = [
    {
        id: '99887766',
        searchValue: '15',
        channel: 'EMAIL',
        userId: '1234',
        locationName: 'Court Name',
        createdDate: '2022-11-18T14:00:00Z',
    },
];

const allSubscriptionMiData = [
    {
        id: '1111',
        channel: 'EMAIL',
        searchType: 'LOCATION_ID',
        userId: '1234',
        locationName: 'Court Name',
        createdDate: '2022-11-18T14:00:00Z',
    },
];

sinon.stub(AccountManagementRequests.prototype, 'getMiAccountsData').resolves(accountMiData);
sinon.stub(PublicationRequests.prototype, 'getMiPublicationData').resolves(publicationMiData);
sinon.stub(SubscriptionRequests.prototype, 'getMiLocationSubscriptionsData').resolves(locationMiData);
sinon.stub(SubscriptionRequests.prototype, 'getMiAllSubscriptionsData').resolves(allSubscriptionMiData);

describe('Download MI Report Service', () => {
    it('should generate user account mi data csv', async () => {
        const data = await downloadMiReportService.generateUserAccountsMiData('user_account');

        expect(data.fileName).to.contain('user_account_report_all_timedays_');
        expect(data.fileName).to.contain('.csv');

        const csv = data.buffer.toString();
        expect(csv).to.contain('userId,provenanceUserId,userProvenance,roles,createdDate,lastSignedInDate');
        expect(csv).to.contain('"1234","11223344","PI_AAD","VERIFIED","2022-11-18T14:00:00Z","2022-11-18T14:00:00Z"');
    });

    it('should generate publication mi data csv', async () => {
        const data = await downloadMiReportService.generatePublicationMiData('publications', 7);

        expect(data.fileName).to.contain('publications_report_7days_');
        expect(data.fileName).to.contain('.csv');

        const csv = data.buffer.toString();

        expect(csv).to.contain(
            'artefactId,displayFrom,displayTo,language,provenance,sensitivity,' +
                'sourceArtefactId,supersededCount,type,contentDate,locationId,locationName,listType'
        );
        expect(csv).to.contain(
            '"12345678","2022-11-18T14:00:00Z","2022-11-20T14:00:00Z","ENGLISH",' +
                '"MANUAL_UPLOAD","PUBLIC","1234","2","LIST","2022-11-18T14:00:00Z","15","Court Name",' +
                '"CIVIL_AND_FAMILY_DAILY_CAUSE_LIST"'
        );
    });

    it('should generate location subscriptions mi data csv', async () => {
        const data = await downloadMiReportService.generateLocationSubscriptionsMiData('location_subscriptions');

        expect(data.fileName).to.contain('location_subscriptions_report_all_timedays_');
        expect(data.fileName).to.contain('.csv');

        const csv = data.buffer.toString();
        expect(csv).to.contain('id,searchValue,channel,userId,locationName,createdDate');
        expect(csv).to.contain('"99887766","15","EMAIL","1234","Court Name","2022-11-18T14:00:00Z"');
    });

    it('should generate all subscriptions mi data csv', async () => {
        const data = await downloadMiReportService.generateAllSubscriptionsMiData('all_subscriptions');

        expect(data.fileName).to.contain('all_subscriptions_report_all_timedays_');
        expect(data.fileName).to.contain('.csv');

        const csv = data.buffer.toString();

        expect(csv).to.contain('id,channel,searchType,userId,locationName,createdDate');
        expect(csv).to.contain('"1111","EMAIL","LOCATION_ID","1234","Court Name","2022-11-18T14:00:00Z"');
    });

    it('should generate all mi data excel', async () => {
        const data = await downloadMiReportService.generateAllDataMiData('all_data', 14);

        expect(data.fileName).to.contain('all_data_report_14days_');
        expect(data.fileName).to.contain('.xlsx');
        expect(data.buffer).to.exist;

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(data.buffer as any);

        expect(workbook.getWorksheet('Publications')).to.exist;
        expect(workbook.getWorksheet('User Accounts')).to.exist;
        expect(workbook.getWorksheet('Location Subscriptions')).to.exist;
        expect(workbook.getWorksheet('All Subscriptions')).to.exist;

        const publicationsSheet = workbook.getWorksheet('Publications');
        expect(publicationsSheet?.getRow(1).getCell(1).value).to.equal('artefactId');
        expect(publicationsSheet?.getRow(2).getCell(1).value).to.equal('12345678');

        const userAccountsSheet = workbook.getWorksheet('User Accounts');
        expect(userAccountsSheet?.getRow(1).getCell(1).value).to.equal('userId');
        expect(userAccountsSheet?.getRow(2).getCell(1).value).to.equal('1234');

        const locationSubsSheet = workbook.getWorksheet('Location Subscriptions');
        expect(locationSubsSheet?.getRow(1).getCell(1).value).to.equal('id');
        expect(locationSubsSheet?.getRow(2).getCell(1).value).to.equal('99887766');

        const allSubsSheet = workbook.getWorksheet('All Subscriptions');
        expect(allSubsSheet?.getRow(1).getCell(1).value).to.equal('id');
        expect(allSubsSheet?.getRow(2).getCell(1).value).to.equal('1111');
    });

    it('should handle null values in CSV data', async () => {
        sinon.restore();
        const returnedData = [
            {
                name: null,
                count: 1,
            },
        ];

        sinon.stub(AccountManagementRequests.prototype, 'getMiAccountsData').resolves(returnedData);

        const data = await downloadMiReportService.generateUserAccountsMiData('user_account');

        const csv = data.buffer.toString();

        expect(csv).to.contain('"","1"');
    });

    it('should return empty CSV when no data returned', async () => {
        sinon.restore();
        sinon.stub(AccountManagementRequests.prototype, 'getMiAccountsData').resolves([]);

        const data = await downloadMiReportService.generateUserAccountsMiData('user_account');

        expect(data.buffer.toString()).to.equal('\uFEFF');
    });
});
