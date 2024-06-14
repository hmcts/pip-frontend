import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/LocationService';
import { ManualUploadService } from '../service/ManualUploadService';
import { UserManagementService } from '../service/UserManagementService';
import { addListDetailsToArray } from '../helpers/listHelper';
import { RemoveListHelperService } from '../service/RemoveListHelperService';

const courtService = new LocationService();
const manualUploadService = new ManualUploadService();
const userManagementService = new UserManagementService();
const removeListHelperService = new RemoveListHelperService();

export default class RemoveListConfirmationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        if (formData.courtLists && formData.locationId) {
            const listsToDelete = removeListHelperService.getSelectedLists(formData);
            const listData = [];
            for (const list of listsToDelete) {
                await addListDetailsToArray(list, req.user?.['userId'], listData);
            }
            res.render('remove-list-confirmation', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-confirmation']),
                removalList: manualUploadService.formatListRemovalValues(listData),
                locationId: formData.locationId,
                court: await courtService.getLocationById(formData.locationId),
                displayError: false,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const listsToDelete = req.body?.artefactIds;
        const locationId = req.body?.locationId;
        const formData = req.body;
        const listData = [];
        if (listsToDelete && locationId) {
            switch (formData['remove-choice']) {
                case 'yes': {
                    const response = await removeListHelperService.removeLists(listsToDelete, req.user?.['userId']);
                    if (response) {
                        await userManagementService.auditAction(
                            req.user,
                            'DELETE_PUBLICATION',
                            removeListHelperService.formatArtefactIdsForAudit(listsToDelete)
                        );
                        res.redirect('/remove-list-success');
                    } else {
                        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
                    }
                    break;
                }
                case 'no': {
                    res.clearCookie('formCookie');
                    res.redirect(`/remove-list-search-results?locationId=${locationId}`);
                    break;
                }
                default:
                    if (Array.isArray(listsToDelete)) {
                        for (const artefactId of listsToDelete) {
                            await addListDetailsToArray(artefactId, req.user?.['userId'], listData);
                        }
                    } else {
                        await addListDetailsToArray(listsToDelete, req.user?.['userId'], listData);
                    }
                    res.render('remove-list-confirmation', {
                        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-confirmation']),
                        court: await courtService.getLocationById(locationId),
                        removalList: manualUploadService.formatListRemovalValues(listData),
                        displayError: true,
                    });
            }
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
