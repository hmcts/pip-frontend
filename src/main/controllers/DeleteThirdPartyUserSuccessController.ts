import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class DeleteThirdPartyUserSuccessController {
    public get(req: PipRequest, res: Response): void {
        res.render(
            'delete-third-party-user-success',
            req.i18n.getDataByLanguage(req.lng)['delete-third-party-user-success']
        );
    }
}
