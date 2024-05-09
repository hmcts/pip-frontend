import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/LocationService';
import { PublicationService } from '../service/PublicationService';
import { ManualUploadService } from '../service/ManualUploadService';
import { DateTime } from 'luxon';
import { UserManagementService } from '../service/UserManagementService';
import { getListDetailsArray } from '../helpers/listHelper';

const publicationService = new PublicationService();
const courtService = new LocationService();
const manualUploadService = new ManualUploadService();
const userManagementService = new UserManagementService();

export default class RemoveListConfirmationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefact;
        if (artefactId) {
            const artefact = await publicationService.getIndividualPublicationMetadata(
                artefactId,
                req.user['userId'],
                true
            );
            artefact.listTypeName = manualUploadService.getListItemName(artefact.listType);
            artefact.contDate = DateTime.fromISO(artefact.contentDate, {
                zone: 'Europe/London',
            }).toFormat('dd MMMM yyyy');
            res.render('remove-list-confirmation', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-confirmation']),
                artefact,
                court: await courtService.getLocationById(artefact.locationId),
                displayError: false,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
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
                        RemoveListConfirmationController.formatArtefactIds(listsToDelete)
                    );
                    res.redirect('/remove-list-success');
                } else {
                    res.render('error', req.i18n.getDataByLanguage(req.lng).error);
                }
                break;
            }
            case 'no': {
                res.redirect(`/remove-list-search-results?locationId=${locationId}`);
                break;
            }
            default:
                if (Array.isArray(listsToDelete)) {
                    for (const artefactId of listsToDelete) {
                        await getListDetailsArray(artefactId, req.user?.['userId'], listData);
                    }
                } else {
                    await getListDetailsArray(listsToDelete, req.user?.['userId'], listData);
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

    private static formatArtefactIds(artefactIds: any) {
        if (Array.isArray(artefactIds)) {
            return `Publications with artefact ids ${artefactIds.join(', ')} successfully deleted`;
        } else {
            return `Publication with artefact id ${artefactIds.toString()} successfully deleted`;
        }
    }
}
