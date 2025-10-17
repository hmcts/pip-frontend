import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { AuditLogService } from '../../service/AuditLogService';
import { AuditLogSearchCriteria } from '../../models/AuditLogSearchCriteria';

const auditLogService = new AuditLogService();
export default class AuditLogViewerController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        if (req.query?.clear) {
            const responseBody = auditLogService.handleFilterClearing(req.query);
            const filterValues = auditLogService.generateFilterKeyValues(responseBody);
            res.redirect(`audit-log-viewer?${filterValues}`);
        } else {
            const filterDate = auditLogService.validateDate(req.query, 'filterDate');
            const pageData = await auditLogService.getFormattedAuditData(
                new AuditLogSearchCriteria(
                    req.query?.page,
                    req.query?.email,
                    req.query?.userId,
                    req.query?.actions,
                    filterDate
                ),
                req.url.split('/audit-log-viewer')[1],
                req.user['userId']
            );
            res.render('system-admin/audit-log-viewer', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['audit-log-viewer']),
                tableHeader: auditLogService.getTableHeaders(),
                auditLogData: pageData['auditLogData'],
                paginationData: pageData['paginationData'],
                emailFieldData: pageData['emailFieldData'],
                userIdFieldData: pageData['userIdFieldData'],
                actionsFieldData: pageData['actionsFieldData'],
                filterDateFieldData: pageData['filterDateFieldData'],
                categories: pageData['categories'],
                displayError: filterDate === null,
            });
        }
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const filterValues = auditLogService.generateFilterKeyValues(req.body);
        res.redirect(`audit-log-viewer?${filterValues}`);
    }
}
