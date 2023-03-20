import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/locationService';
import { PublicationService } from '../service/publicationService';
import { ManualUploadService } from '../service/manualUploadService';
import { DateTime } from 'luxon';
import { UserManagementService } from '../service/userManagementService';

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
        const formData = req.body;
        const artefact = await publicationService.getIndividualPublicationMetadata(
            formData.artefactId,
            req.user?.['userId'],
            true
        );
        switch (formData['remove-choice']) {
            case 'yes': {
                const response = await publicationService.removePublication(formData.artefactId, req.user?.['userId']);

                if (response) {
                    await userManagementService.auditAction(
                        req.user,
                        'DELETE_PUBLICATION',
                        `Publication with artefact id ${formData.artefactId} successfully deleted`
                    );
                    res.redirect('/remove-list-success');
                } else {
                    res.render('error', req.i18n.getDataByLanguage(req.lng).error);
                }
                break;
            }
            case 'no': {
                res.redirect(`/remove-list-search-results?locationId=${formData.locationId}`);
                break;
            }
            default:
                artefact.listTypeName = manualUploadService.getListItemName(artefact.listType);
                res.render('remove-list-confirmation', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-confirmation']),
                    artefact,
                    court: await courtService.getLocationById(formData.locationId),
                    displayError: true,
                });
        }
    }
}
