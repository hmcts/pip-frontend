import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { MediaApplicationService } from '../service/mediaApplicationService';
import { cloneDeep } from 'lodash';

const mediaApplicationService = new MediaApplicationService();

export default class MediaApplicationsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const mediaApplications = await mediaApplicationService.getDateOrderedMediaApplications();
        res.render('media-applications', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-applications']),
            mediaApplications,
        });
    }
}
