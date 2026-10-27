import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserCommService } from '../service/UserCommService';

const userCommService = new UserCommService();

export default class HomeController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userComms = await userCommService.getUserComms();

        const currentLanguage = req?.lng ? req.lng : 'en';
        res.render('home', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng).home),
            currentLanguage,
            userComms,
        });
    }
}
