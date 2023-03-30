import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { MediaAccountApplicationService } from '../service/mediaAccountApplicationService';
import { cloneDeep } from 'lodash';
import { UserManagementService } from '../service/userManagementService';

const mediaAccountApplicationService = new MediaAccountApplicationService();
const userManagementService = new UserManagementService();
const rejectReasons = require('../../main/resources/media-account-rejection-reasons-lookup.json');

export default class MediaAccountRejectionController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const reasons = req.body['reasons'];
        const applicantId = req.body['applicantId'];
        const applicantData = await mediaAccountApplicationService.getApplicationByIdAndStatus(applicantId, 'PENDING');

        if (applicantData) {
            res.render('media-account-rejection', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-rejection']),
                applicantData: applicantData,
                reasons: reasons,
            });
            return;
        }

        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const applicantId = req.query['applicantId'];
        const rejected = req.body['reject-confirmation'];
        const reasons = req.body['reasons'];

        const applicantData = await mediaAccountApplicationService.getApplicationByIdAndStatus(applicantId, 'PENDING');
        if (applicantData) {
            return MediaAccountRejectionController.applicationFoundFlow(
                req,
                res,
                rejected,
                applicantId,
                reasons,
                applicantData
            );
        }
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    /**
     * This handles the pages that render when submitting a rejection, if the applicant has been found.
     */
    private static applicationFoundFlow(req, res, rejected, applicantId, reasons, applicantData): Promise<void> {
        if (!rejected) {
            return res.render('media-account-rejection', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-rejection']),
                applicantData,
                reasons,
                displayRadioError: true,
            });
        }

        if (rejected === 'Yes') {
            return MediaAccountRejectionController.rejectionFlow(req, res, applicantId, reasons);
        } else {
            return res.redirect('/media-account-review?applicantId=' + applicantId);
        }
    }

    private static getJsonSubset(keys) {
        const keysArray = keys.split(',');
        const subset = {};
        keysArray.forEach(key => {
            if (key in rejectReasons) {
                subset[key] = rejectReasons[key];
            } else {
                throw new Error(`Invalid rejection reason chosen: ${key}`);
            }
        });
        return subset;
    }

    /**
     * This handles the pages that render if the user has selected 'Reject' on the screen.
     */
    private static async rejectionFlow(req, res, applicantId, reasons): Promise<void> {
        const applicantData = await mediaAccountApplicationService.getApplicationById(req.body.applicantId);
        const url = 'media-account-rejection-confirmation';
        if (
            await mediaAccountApplicationService.rejectApplication(
                applicantId,
                req.user?.['userId'],
                this.getJsonSubset(reasons)
            )
        ) {
            await userManagementService.auditAction(
                req.user,
                'REJECT_MEDIA_APPLICATION',
                `Media application with id ${applicantId} rejected`
            );
            return res.render(url, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[url]),
                applicantData,
                reasons: reasons,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
