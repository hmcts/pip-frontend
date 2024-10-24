import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class SubscriptionAddListLanguageController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        if (req.query.error === 'true') {
            res.render('subscription-add-list-language', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-add-list-language']),
                noSelectionError: true,
            });
        } else {
            res.render('subscription-add-list-language', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-add-list-language']),
                noSelectionError: false,
            });
        }
    }
}
