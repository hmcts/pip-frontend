import { PublicationService } from '../../service/PublicationService';
import { cloneDeep } from 'lodash';
import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';

const publicationService = new PublicationService();

export default class EditListTypeSearchConfigController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const listType = req.query.listType as string;

        if (listType) {
            let formData = await publicationService.getListSearchConfigByListType(listType, req.user['userId']);

            if (!formData) {
                const cookieData = req.cookies?.listSearchConfigCookie
                    ? JSON.parse(req.cookies['listSearchConfigCookie'])
                    : null;
                formData = cookieData?.listType === listType ? cookieData : { createConfig: 'true' };
            }

            res.render('system-admin/edit-list-type-search-config', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['edit-list-type-search-config']),
                listType,
                listTypeName: publicationService.getListTypes().get(listType).friendlyName,
                formData,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public post(req: PipRequest, res: Response): void {
        const listType = req.query.listType as string;
        const formData = req.body;

        if (listType) {
             const cookie = {
                 listType,
                 ...formData,
             };
            res.cookie('listSearchConfigCookie', JSON.stringify(cookie), { secure: true, httpOnly: true });
            res.redirect('/edit-list-type-search-config-summary');
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
