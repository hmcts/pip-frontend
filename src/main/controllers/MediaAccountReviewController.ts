import { PipRequest } from '../models/request/PipRequest';
import { MediaAccountApplicationService } from '../service/MediaAccountApplicationService';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { fileTypeMappings } from '../helpers/consts';
import * as url from 'url';

const mediaAccountApplicationService = new MediaAccountApplicationService();

export default class MediaAccountReviewController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const applicantId = req.query['applicantId'];
        const applicantData = await mediaAccountApplicationService.getApplicationByIdAndStatus(applicantId, 'PENDING');
        if (applicantData) {
            return res.render('media-account-review', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-review']),
                applicantData: applicantData,
            });
        }
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public async getImage(req: PipRequest, res: Response): Promise<void> {
        const imageId = req.query['imageId'];
        const applicantId = req.query['applicantId'];
        const image = await mediaAccountApplicationService.getImageById(imageId);
        const applicant = await mediaAccountApplicationService.getApplicationById(applicantId);

        if (image && applicant) {
            const imageName = applicant.imageName;
            const extension = imageName.substring(imageName.lastIndexOf('.') + 1, imageName.length);

            const contentType = fileTypeMappings[extension.toLowerCase()];
            if (contentType) {
                res.set('Content-Disposition', 'inline;filename=' + imageName);
                res.set('Content-Type', contentType);
                res.send(image);
                return;
            }
        }

        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public approve(req: PipRequest, res: Response): void {
        const applicantId = req.body['applicantId'];
        if (applicantId) {
            res.redirect(url.format({
                pathname: '/media-account-approval',
                query: { applicantId: applicantId }
            }));
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public reject(req: PipRequest, res: Response): void {
        const applicantId = req.body['applicantId'];
        if (applicantId) {
            res.redirect(url.format({
                pathname: '/media-account-rejection-reasons',
                query: { applicantId: applicantId }
            }));
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
