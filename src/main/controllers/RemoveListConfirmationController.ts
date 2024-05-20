import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/LocationService';
import { PublicationService } from '../service/PublicationService';
import { ManualUploadService } from '../service/ManualUploadService';
import { UserManagementService } from '../service/UserManagementService';
import { addListDetailsToArray } from '../helpers/listHelper';

const publicationService = new PublicationService();
const courtService = new LocationService();
const manualUploadService = new ManualUploadService();
const userManagementService = new UserManagementService();

export default class RemoveListConfirmationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        const listsToDelete = RemoveListConfirmationController.getSelectedLists(formData);
        const listData = [];
        for (const list of listsToDelete) {
            await addListDetailsToArray(list, req.user?.['userId'], listData);
        }
        res.render('remove-list-confirmation', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-confirmation']),
            removalList: manualUploadService.formatListRemovalValues(listData),
            locationId: formData.locationId,
            displayError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const listsToDelete = req.body.artefactIds;
        const locationId = req.body.locationId;
        const formData = req.body;
        const listData = [];
        switch (formData['remove-choice']) {
            case 'yes': {
                const response = await RemoveListConfirmationController.removeLists(
                    listsToDelete,
                    req.user?.['userId']
                );
                if (response) {
                    await userManagementService.auditAction(
                        req.user,
                        'DELETE_PUBLICATION',
                        RemoveListConfirmationController.formatArtefactIdsForAudit(listsToDelete)
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
    }

    private static async removeLists(artefactIds: any, userId: string) {
        let response = true;
        if (Array.isArray(artefactIds)) {
            for (const artefactId of artefactIds) {
                response = await publicationService.removePublication(artefactId, userId);
                if (!response) {
                    return (response = false);
                }
            }
        } else {
            response = await publicationService.removePublication(artefactIds, userId);
        }
        return response;
    }

    private static formatArtefactIdsForAudit(artefactIds: any) {
        if (Array.isArray(artefactIds)) {
            return `Publications with artefact ids ${artefactIds.join(', ')} successfully deleted`;
        } else {
            return `Publication with artefact id ${artefactIds.toString()} successfully deleted`;
        }
    }

    private static getSelectedLists(formData: { courtLists: any }): string[] {
        const { courtLists } = formData;
        const listsToDelete = [];
        if (courtLists !== undefined) {
            RemoveListConfirmationController.addToListsForDeletion(courtLists, listsToDelete);
        }
        return listsToDelete;
    }

    private static addToListsForDeletion(lists: any, listsToDelete: any[]): void {
        if (Array.isArray(lists)) {
            listsToDelete.push(...lists);
        } else {
            listsToDelete.push(lists);
        }
    }
}
