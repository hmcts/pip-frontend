import { cloneDeep } from 'lodash';
import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';
import { PublicationService } from '../../service/PublicationService';
import { UserManagementService } from '../../service/UserManagementService';

const publicationService = new PublicationService();
const userManagementService = new UserManagementService();

export default class EditListTypeSearchConfigSummaryController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.listSearchConfigCookie ? JSON.parse(req.cookies['listSearchConfigCookie']) : {};

        res.render('system-admin/edit-list-type-search-config-summary', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['edit-list-type-search-config-summary']),
            formData,
            displayError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.listSearchConfigCookie ? JSON.parse(req.cookies['listSearchConfigCookie']) : {};

        const requesterId = req.user?.['userId'];

        const response = formData.createConfig
            ? await publicationService.createListSearchConfig(formData, requesterId)
            : await publicationService.updateListSearchConfig(formData.id, formData, requesterId);

        if (response) {
            await userManagementService.auditAction(
                req.user,
                formData.createConfig ? 'CREATE_LIST_SEARCH_CONFIG' : 'UPDATE_LIST_SEARCH_CONFIG',
                formData.createConfig
                    ? 'List search configuration created successfully'
                    : 'List search configuration updated successfully'
            );
            res.clearCookie('listSearchConfigCookie');
            res.redirect('/edit-list-type-search-config-success');
            return;
        }

        res.render('system-admin/edit-list-type-search-config-summary', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['edit-list-type-search-config-summary']),
            formData,
            displayError: true,
        });
    }
}
