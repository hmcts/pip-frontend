import { mockRequest } from '../../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import { DownloadMiReportService } from '../../../../main/service/DownloadMiReportService';
import DownloadMiReportController from '../../../../main/controllers/system-admin/DownloadMiReportController';

const downloadMiReportController = new DownloadMiReportController();

const i18n = {
    'download-mi-report': {},
};

const buffer = Buffer.from('test csv');
sinon.stub(DownloadMiReportService.prototype, 'generateUserAccountsMiData').withArgs('user_account').resolves({
    fileName: 'user_accounts.csv',
    buffer,
});
sinon.stub(DownloadMiReportService.prototype, 'generatePublicationMiData').withArgs('publications').resolves({
    fileName: 'publications.csv',
    buffer,
});
sinon.stub(DownloadMiReportService.prototype, 'generateLocationSubscriptionsMiData')
    .withArgs('location_subscriptions').resolves({
        fileName: 'location_subscriptions.csv',
        buffer,
    });
sinon.stub(DownloadMiReportService.prototype, 'generateAllSubscriptionsMiData').withArgs('all_subscriptions').resolves({
    fileName: 'all_subscriptions.csv',
    buffer,
});
sinon.stub(DownloadMiReportService.prototype, 'generateAllDataMiData').withArgs('all_data').resolves({
    fileName: 'all_data.csv',
    buffer,
});

describe('Download Mi Report controller', () => {
    const response = {
        render: () => {
            return '';
        },
        set: () => {
            return '';
        },
        send: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);

    it('should render the download mi report page', async () => {
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['download-mi-report'],
        };

        responseMock.expects('render').once().withArgs('system-admin/download-mi-report', expectedData);

        downloadMiReportController.get(request, response);
        responseMock.verify();
    });

    it('should generate user accounts MI report', async () => {
        request.body = {
            reportType: 'USER_ACCOUNTS',
            reportDuration: '-1'
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('set').once().withArgs('Content-Disposition', 'attachment; filename=user_accounts.csv');
        responseMock.expects('set').once().withArgs('Content-Type', 'text/csv; charset=utf-8');
        responseMock.expects('send').once().withArgs(buffer);

        await downloadMiReportController.post(request, response);

        responseMock.verify();
    });

    it('should generate publications MI report', async () => {
        request.body = {
            reportType: 'PUBLICATIONS',
            reportDuration: '-1',
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('set').once().withArgs('Content-Disposition', 'attachment; filename=publications.csv');
        responseMock.expects('set').once().withArgs('Content-Type', 'text/csv; charset=utf-8');
        responseMock.expects('send').once().withArgs(buffer);

        await downloadMiReportController.post(request, response);

        responseMock.verify();
    });

    it('should generate location subscriptions MI report', async () => {
        request.body = {
            reportType: 'LOCATION_SUBSCRIPTIONS',
            reportDuration: '-1',
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('set').once().withArgs('Content-Disposition', 'attachment; filename=location_subscriptions.csv');
        responseMock.expects('set').once().withArgs('Content-Type', 'text/csv; charset=utf-8');
        responseMock.expects('send').once().withArgs(buffer);

        await downloadMiReportController.post(request, response);

        responseMock.verify();
    });

    it('should generate all subscriptions MI report', async () => {
        request.body = {
            reportType: 'ALL_SUBSCRIPTIONS',
            reportDuration: '-1',
        };

        const responseMock = sinon.mock(response);

        responseMock
            .expects('set')
            .once()
            .withArgs('Content-Disposition', 'attachment; filename=all_subscriptions.csv');
        responseMock.expects('set').once().withArgs('Content-Type', 'text/csv; charset=utf-8');
        responseMock.expects('send').once().withArgs(buffer);

        await downloadMiReportController.post(request, response);

        responseMock.verify();
    });

    it('should generate all data MI report', async () => {
        request.body = {
            reportType: 'ALL_DATA',
            reportDuration: '-1',
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('set').once().withArgs('Content-Disposition', 'attachment; filename=all_data.csv');
        responseMock.expects('set').once().withArgs('Content-Type', 'text/csv; charset=utf-8');
        responseMock.expects('send').once().withArgs(buffer);

        await downloadMiReportController.post(request, response);

        responseMock.verify();
    });

    it('should generate all data MI report by default', async () => {
        request.body = {
            reportType: '',
            reportDuration: '-1',
        };

        const responseMock = sinon.mock(response);

        responseMock.expects('set').once().withArgs('Content-Disposition', 'attachment; filename=all_data.csv');
        responseMock.expects('set').once().withArgs('Content-Type', 'text/csv; charset=utf-8');
        responseMock.expects('send').once().withArgs(buffer);

        await downloadMiReportController.post(request, response);

        responseMock.verify();
    });
});
