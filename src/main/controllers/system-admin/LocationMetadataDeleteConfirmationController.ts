import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../../service/LocationService';
import url from 'url';
import { UserManagementService } from '../../service/UserManagementService';

const locationService = new LocationService();
const userManagementService = new UserManagementService();

export default class LocationMetadataDeleteConfirmationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const locationId = req.query?.locationId as unknown as number;
        if (locationId) {
            const location = await locationService.getLocationById(locationId);
            res.render('system-admin/location-metadata-delete-confirmation', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['location-metadata-delete-confirmation']),
                location,
                noOptionError: false,
                failedRequestError: false,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const locationId = req.query?.locationId as unknown as number;
        if (locationId) {
            const locationMetadata = await locationService.getLocationMetadata(locationId);
            if (locationMetadata) {
                const location = await locationService.getLocationById(locationId);
                if (req.body['delete-location-metadata-confirm'] === 'yes') {
                    const success = await locationService.deleteLocationMetadata(
                        locationMetadata.locationMetadataId,
                        req.user['userId']
                    );
                    if (success) {
                        await userManagementService.auditAction(
                            req.user,
                            'DELETE_LOCATION_METADATA',
                            `Location metadata for location with ID ${location.locationId} has been deleted`
                        );
                        res.redirect('location-metadata-delete-confirmed');
                    } else {
                        res.render('system-admin/location-metadata-delete-confirmation', {
                            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['location-metadata-delete-confirmation']),
                            location,
                            noOptionError: false,
                            failedRequestError: true,
                        });
                    }
                } else if (req.body['delete-location-metadata-confirm'] === 'no') {
                    res.redirect(
                        url.format({
                            pathname: 'location-metadata-manage',
                            query: { locationId: locationId },
                        })
                    );
                } else {
                    res.render('system-admin/location-metadata-delete-confirmation', {
                        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['location-metadata-delete-confirmation']),
                        location,
                        noOptionError: true,
                        failedRequestError: false,
                    });
                }
            } else {
                res.render('error', req.i18n.getDataByLanguage(req.lng).error);
            }
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
