import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { LocationService } from '../../service/LocationService';
import { cloneDeep } from 'lodash';
import { UserManagementService } from '../../service/UserManagementService';

const locationService = new LocationService();
const userManagementService = new UserManagementService();

export default class LocationMetadataManageController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const locationId = req.query?.locationId as unknown as number;
        if (locationId) {
            const location = await locationService.getLocationById(locationId);
            const locationMetadata = await locationService.getLocationMetadata(locationId);
            res.render('system-admin/location-metadata-manage', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['location-metadata-manage']),
                location,
                locationMetadata,
                updateError: false,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const locationId = req.query?.locationId as unknown as number;
        if (locationId) {
            const location = await locationService.getLocationById(locationId);
            const locationMetadata = await locationService.getLocationMetadata(locationId);

            const success = locationMetadata
                ? await locationService.updateLocationMetadata(
                      locationMetadata.locationMetadataId,
                      locationId,
                      req.body?.['english-caution-message'],
                      req.body?.['welsh-caution-message'],
                      req.body?.['english-no-list-message'],
                      req.body?.['welsh-no-list-message'],
                      req.user['userId']
                  )
                : await locationService.addLocationMetadata(
                      locationId,
                      req.body?.['english-caution-message'],
                      req.body?.['welsh-caution-message'],
                      req.body?.['english-no-list-message'],
                      req.body?.['welsh-no-list-message'],
                      req.user['userId']
                  );

            if (success) {
                await userManagementService.auditAction(
                    req.user,
                    locationMetadata ? 'UPDATE_LOCATION_METADATA' : 'CREATE_LOCATION_METADATA',
                    `Location metadata for location with ID ${location.locationId} has been ` +
                        (locationMetadata ? 'updated' : 'created')
                );
                res.redirect(
                    locationMetadata ? 'location-metadata-update-confirmed' : 'location-metadata-create-confirmed'
                );
            } else {
                res.render('system-admin/location-metadata-manage', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['location-metadata-manage']),
                    location,
                    locationMetadata,
                    updateError: true,
                });
            }
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
