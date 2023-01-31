import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';

export default class AccessibilityStatementController {
    public get(req: PipRequest, res: Response): void {
        res.render('accessibility-statement', req.i18n.getDataByLanguage(req.lng)['accessibility-statement']);
    }
}
