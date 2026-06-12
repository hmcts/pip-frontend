import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { DownloadMiReportService } from '../../service/DownloadMiReportService';

const downloadMiReportService = new DownloadMiReportService();

export default class DownloadMiReportController {
    public get(req: PipRequest, res: Response): void {
        res.render('system-admin/download-mi-report', req.i18n.getDataByLanguage(req.lng)['download-mi-report']);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const reportDuration = req.body['reportDuration'];
        let result: any;
        switch (req.body?.['reportType']) {
            case 'USER_ACCOUNTS': {
                result = await downloadMiReportService.generateUserAccountsMiData('user_account');
                break;
            }
            case 'PUBLICATIONS': {
                result = await downloadMiReportService.generatePublicationMiData('publications', reportDuration);
                break;
            }
            case 'LOCATION_SUBSCRIPTIONS': {
                result = await downloadMiReportService.generateLocationSubscriptionsMiData('location_subscriptions');
                break;
            }
            case 'ALL_SUBSCRIPTIONS': {
                result = await downloadMiReportService.generateAllSubscriptionsMiData('all_subscriptions');
                break;
            }
            case 'ALL_DATA': {
                result = await downloadMiReportService.generateAllDataMiData('all_data', reportDuration);
                break;
            }
            default: {
                result = await downloadMiReportService.generateAllDataMiData('all_data', reportDuration);
                break;
            }
        }

        // Convert JSON string to byte array
        res.set('Content-Disposition', `attachment; filename=${result.fileName}`);
        res.set('Content-Type', 'text/csv; charset=utf-8');

        res.send(result.buffer);
    }
}
