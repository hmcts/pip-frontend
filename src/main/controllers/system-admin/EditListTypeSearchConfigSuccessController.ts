import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';

export default class EditListTypeSearchConfigSuccessController {
    public get(req: PipRequest, res: Response): void {
        res.render(
            'system-admin/edit-list-type-search-config-success',
            req.i18n.getDataByLanguage(req.lng)['edit-list-type-search-config-success']
        );
    }
}
