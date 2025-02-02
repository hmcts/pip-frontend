import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../../service/LocationService';
import { UserManagementService } from '../../service/UserManagementService';

const locationService = new LocationService();
const userManagementService = new UserManagementService();

export default class DeleteCourtReferenceDataConfirmationController {
    public async get(req: PipRequest, res: Response, page: string): Promise<void> {
        const locationId = req.query.locationId as unknown as number;
        if (locationId) {
            const court = await locationService.getLocationById(locationId);
            res.render(`system-admin/${page}`, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[page]),
                court: locationService.formatCourtValue(court),
                displayError: false,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.body;
        const court = await locationService.getLocationById(formData.locationId as unknown as number);
        switch (formData['delete-choice']) {
            case 'yes': {
                const response = await locationService.deleteLocationById(formData.locationId, req.user?.['userId']);

                if (response?.['exists']) {
                    await userManagementService.auditAction(
                        req.user,
                        'DELETE_LOCATION_ATTEMPT',
                        'Location attempted to be deleted with id: ' + formData.locationId
                    );
                    res.render('system-admin/delete-court-reference-data-confirmation', {
                        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-court-reference-data-confirmation']),
                        court: locationService.formatCourtValue(court),
                        apiError: response['exists'],
                        errorMessage: response['errorMessage'],
                    });
                } else if (response === null) {
                    await userManagementService.auditAction(
                        req.user,
                        'DELETE_LOCATION_ATTEMPT',
                        'Location attempted to be deleted with id: ' + formData.locationId
                    );
                    res.render('system-admin/delete-court-reference-data-confirmation', {
                        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-court-reference-data-confirmation']),
                        court: locationService.formatCourtValue(court),
                        apiError: true,
                        errorMessage: 'Unknown error when attempting to delete the court from reference data',
                    });
                } else {
                    await userManagementService.auditAction(
                        req.user,
                        'DELETE_LOCATION_SUCCESS',
                        'Location has been deleted with id: ' + formData.locationId
                    );
                    res.redirect('/delete-court-reference-data-success');
                }
                break;
            }
            case 'no': {
                res.redirect('/delete-court-reference-data');
                break;
            }
            default:
                res.render('system-admin/delete-court-reference-data-confirmation', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-court-reference-data-confirmation']),
                    court: locationService.formatCourtValue(court),
                    apiError: false,
                    displayError: true,
                });
        }
    }
}
