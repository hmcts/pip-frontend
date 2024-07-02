import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { LocationService } from '../../service/LocationService';
import { cloneDeep } from 'lodash';

const locationService = new LocationService();

export default class RemoveListSearchController {
    public async get(req: PipRequest, res: Response, page: string): Promise<void> {
        const autocompleteList = await locationService.fetchAllLocations(req.lng);
        res.render(page, {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[page]),
            autocompleteList,
            invalidInputError: false,
            noResultsError: false,
        });
    }

    public async post(req: PipRequest, res: Response, page: string): Promise<void> {
        let resultPage = 'remove-list-search-results';
        if (page.includes('delete-court-reference-data')) {
            resultPage = 'delete-court-reference-data-confirmation';
        }
        const searchInput = req.body['input-autocomplete'];
        const autocompleteList = await locationService.fetchAllLocations(req.lng);
        if (searchInput && searchInput.length >= 3) {
            const court = await locationService.getLocationByName(searchInput, req.lng);
            court
                ? res.redirect(`${resultPage}?locationId=${court.locationId}`)
                : res.render(page, {
                      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[page]),
                      autocompleteList,
                      invalidInputError: false,
                      noResultsError: true,
                  });
        } else {
            res.render(page, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[page]),
                autocompleteList,
                invalidInputError: true,
                noResultsError: false,
            });
        }
    }
}
