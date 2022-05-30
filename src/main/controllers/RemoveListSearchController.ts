import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { LocationService } from '../service/locationService';
import { cloneDeep } from 'lodash';

const locationService = new LocationService();

export default class RemoveListSearchController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const autocompleteList = await locationService.fetchAllLocations();
    res.render('remove-list-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-search']),
      autocompleteList,
      invalidInputError: false,
      noResultsError: false,
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.body['input-autocomplete'];
    const autocompleteList = await locationService.fetchAllLocations();
    if (searchInput && searchInput.length >= 3) {
      const court = await locationService.getLocationByName(searchInput);
      (court) ?
        res.redirect(`remove-list-search-results?locationId=${court.locationId}`) :
        res.render('remove-list-search', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-search']),
          autocompleteList,
          invalidInputError: false,
          noResultsError: true,
        });
    } else {
      res.render('remove-list-search', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-search']),
        autocompleteList,
        invalidInputError: true,
        noResultsError: false,
      });
    }
  }
}
