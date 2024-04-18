import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { LocationService } from '../service/locationService';
import { cloneDeep } from 'lodash';

const locationService = new LocationService();

export default class RemoveListSearchController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const pageToLoad = req.path.slice(1, req.path.length);
        const autocompleteList = await locationService.fetchAllLocations(req.lng);
        res.render(pageToLoad, {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[pageToLoad]),
            autocompleteList,
            invalidInputError: false,
            noResultsError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const pageToLoad = req.path.slice(1, req.path.length);
        let resultPage = 'remove-list-search-results';
        if (pageToLoad.includes('delete-court-reference-data')) {
            resultPage = 'delete-court-reference-data-confirmation';
        }
        const searchInput = req.body['input-autocomplete'];
        const autocompleteList = await locationService.fetchAllLocations(req.lng);
        if (searchInput && searchInput.length >= 3) {
            const court = await locationService.getLocationByName(searchInput, req.lng);
            court
                ? res.redirect(`${resultPage}?locationId=${court.locationId}`)
                : res.render(pageToLoad, {
                      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[pageToLoad]),
                      autocompleteList,
                      invalidInputError: false,
                      noResultsError: true,
                  });
        } else {
            res.render(pageToLoad, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[pageToLoad]),
                autocompleteList,
                invalidInputError: true,
                noResultsError: false,
            });
        }
    }
}
