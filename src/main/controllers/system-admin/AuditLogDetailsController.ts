import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { AuditLogService } from '../../service/AuditLogService';
import { cloneDeep } from 'lodash';

const auditLogService = new AuditLogService();

export default class AuditLogDetailsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const formattedData = await auditLogService.buildAuditLogDetailsSummaryList(
            req.query.id as string,
            req.user['userId']
        );

        res.render('system-admin/audit-log-details', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['audit-log-details']),
            timestamp: req.query.timestamp,
            formattedData,
        });
    }
}
