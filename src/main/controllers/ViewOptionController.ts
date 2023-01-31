import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';

export default class ViewOptionController {
    public get(req: PipRequest, res: Response): void {
        res.render('view-option', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['view-option']),
            showError: false,
        });
    }

    public post(req: PipRequest, res: Response): void {
        if (req.body['view-choice'] === 'search') {
            res.redirect('search');
        } else if (req.body['view-choice'] === 'live') {
            res.redirect('live-case-alphabet-search');
        } else if (req.body['view-choice'] === 'sjp') {
            res.redirect('summary-of-publications?locationId=9');
        } else {
            res.render('view-option', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['view-option']),
                showError: true,
            });
        }
    }
}
