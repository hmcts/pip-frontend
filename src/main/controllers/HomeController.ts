import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserCommunicationService } from '../service/UserCommunicationService';

const userCommunicationService = new UserCommunicationService();

export default class HomeController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userCommunications = await userCommunicationService.getUserCommunications();

        const currentLanguage = req?.lng ? req.lng : 'en';
        res.render('home', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng).home),
            currentLanguage,
            userCommunications,
        });
    }
}
