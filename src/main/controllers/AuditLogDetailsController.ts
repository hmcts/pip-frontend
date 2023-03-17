import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { AuditLogService } from '../service/auditLogService';
import { cloneDeep } from 'lodash';

const auditLogService = new AuditLogService();
const url = 'audit-log-details';

export default class AuditLogDetailsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const formattedData = await auditLogService.buildAuditLogDetailsSummaryList(req.query.id as string);

        res.render(url, {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[url]),
            timestamp: req.query.timestamp,
            formattedData,
        });
    }
}
