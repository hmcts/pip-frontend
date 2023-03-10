import { Response } from 'express';
import { LocationService } from '../service/locationService';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';

const courtService = new LocationService();

export default class SearchController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const autocompleteList = await courtService.fetchAllLocations(req.lng);
        res.render('search', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng).search),
            autocompleteList: autocompleteList,
            noResultsError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const searchInput = req.body['input-autocomplete'];
        const autocompleteList = await courtService.fetchAllLocations(req.lng);
        const court = await courtService.getLocationByName(searchInput, req.lng);
        court && searchInput
            ? res.redirect(`summary-of-publications?locationId=${court.locationId}`)
            : res.render('search', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng).search),
                  autocompleteList: autocompleteList,
                  noResultsError: true,
              });
    }
}
