import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { LocationService } from '../../service/LocationService';
import { cloneDeep } from 'lodash';

const locationService = new LocationService();

export default class DeleteCourtReferenceDataController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const autocompleteList = await locationService.fetchAllLocations(req.lng);
        res.render('system-admin/delete-court-reference-data', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['system-admin']['delete-court-reference-data']),
            autocompleteList,
            invalidInputError: false,
            noResultsError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const searchInput = req.body['input-autocomplete'];
        const autocompleteList = await locationService.fetchAllLocations(req.lng);
        if (searchInput && searchInput.length >= 3) {
            const court = await locationService.getLocationByName(searchInput, req.lng);
            court
                ? res.redirect(`delete-court-reference-data-confirmation?locationId=${court.locationId}`)
                : res.render('system-admin/delete-court-reference-data', {
                      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['system-admin']['delete-court-reference-data']),
                      autocompleteList,
                      invalidInputError: false,
                      noResultsError: true,
                  });
        } else {
            res.render('system-admin/delete-court-reference-data', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['system-admin']['delete-court-reference-data']),
                autocompleteList,
                invalidInputError: true,
                noResultsError: false,
            });
        }
    }
}
