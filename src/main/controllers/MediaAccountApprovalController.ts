import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { MediaAccountApplicationService } from '../service/mediaAccountApplicationService';
import { UserManagementService } from '../service/userManagementService';

const mediaAccountApplicationService = new MediaAccountApplicationService();
const userManagementService = new UserManagementService();

export default class MediaAccountApprovalController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const applicantId = req.query['applicantId'];
        const applicantData = await mediaAccountApplicationService.getApplicationByIdAndStatus(applicantId, 'PENDING');

        if (applicantData) {
            res.render('media-account-approval', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-approval']),
                applicantData: applicantData,
            });
            return;
        }

        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const applicantId = req.body['applicantId'];
        const approved = req.body['approved'];
        const applicantData = await mediaAccountApplicationService.getApplicationByIdAndStatus(applicantId, 'PENDING');

        if (applicantData) {
            return MediaAccountApprovalController.applicationFoundFlow(req, res, approved, applicantId, applicantData);
        }
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    /**
     * This handles the pages that render when submitting an approval, if the applicant has been found.
     */
    private static applicationFoundFlow(req, res, approved, applicantId, applicantData): Promise<void> {
        if (!approved) {
            return res.render('media-account-approval', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-approval']),
                applicantData: applicantData,
                displayRadioError: true,
            });
        }

        if (approved === 'Yes') {
            return MediaAccountApprovalController.approvalFlow(req, res, applicantId, applicantData);
        } else {
            return res.redirect('/media-account-review?applicantId=' + applicantId);
        }
    }

    /**
     * This handles the pages that render if the user has selected 'Approve' on the screen.
     */
    private static async approvalFlow(req, res, applicantId, applicantData): Promise<void> {
        if (await mediaAccountApplicationService.createAccountFromApplication(applicantId, req.user['userId'])) {
            await userManagementService.auditAction(
                req.user,
                'APPROVE_MEDIA_APPLICATION',
                `Media application with id ${applicantId} approved`
            );
            return res.redirect('/media-account-approval-confirmation?applicantId=' + applicantId);
        } else {
            return res.render('media-account-approval', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-approval']),
                applicantData: applicantData,
                displayAzureError: true,
            });
        }
    }
}
