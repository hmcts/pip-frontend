import { PublicationService } from '../../service/PublicationService';
import { cloneDeep } from 'lodash';
import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';

const publicationService = new PublicationService();

export default class ManageListTypesController {
    public get(req: PipRequest, res: Response): void {
        const listTypes = [];
        publicationService.getListTypes().forEach((value, key) => {
            if (!value.isHidden) {
                listTypes.push({
                    id: key,
                    name: value.friendlyName,
                });
            }
        });
        listTypes.sort((a, b) => a.name.localeCompare(b.name));

        res.render('system-admin/manage-list-types', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-list-types']),
            listTypes,
        });
    }
}
