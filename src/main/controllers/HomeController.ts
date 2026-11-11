import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class HomeController {
    public get(req: PipRequest, res: Response): void {
        const currentLanguage = req?.lng ? req.lng : 'en';
        res.render('home', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng).home),
            currentLanguage,
        });
    }
}
