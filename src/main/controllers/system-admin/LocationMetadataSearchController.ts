import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { LocationService } from '../../service/LocationService';
import { cloneDeep } from 'lodash';

const locationService = new LocationService();

export default class LocationMetadataSearchController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const autocompleteList = await locationService.fetchAllLocations(req.lng);
        res.render('system-admin/location-metadata-search', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['location-metadata-search']),
            autocompleteList,
            invalidInputError: false,
            noResultsError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const searchInput = req.body?.['input-autocomplete'];
        const autocompleteList = await locationService.fetchAllLocations(req.lng);
        if (searchInput && searchInput.length >= 3) {
            const court = await locationService.getLocationByName(searchInput, req.lng);
            court
                ? res.redirect(`location-metadata-manage?locationId=${court.locationId}`)
                : res.render('system-admin/location-metadata-search', {
                      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['location-metadata-search']),
                      autocompleteList,
                      invalidInputError: false,
                      noResultsError: true,
                  });
        } else {
            res.render('system-admin/location-metadata-search', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['location-metadata-search']),
                autocompleteList,
                invalidInputError: true,
                noResultsError: false,
            });
        }
    }
}
