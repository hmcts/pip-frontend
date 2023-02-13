import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { AuditLogService } from '../service/auditLogService';

const auditLogService = new AuditLogService();
export default class AuditLogViewerController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const pageData = await auditLogService.getFormattedAuditData(
            parseInt(<string>req.query.page) || 1,
            req.user['userId']
        );
        res.render('audit-log-viewer', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['audit-log-viewer']),
            header: auditLogService.getTableHeaders(),
            auditLogData: pageData['auditLogData'],
            paginationData: pageData['paginationData'],
        });
    }
}
