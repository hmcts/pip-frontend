import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { CourtService } from '../service/courtService';
import { cloneDeep } from 'lodash';

const courtService = new CourtService();

export default class RemoveListSearchController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const autocompleteList = await courtService.fetchAllCourts();
    res.render('remove-list-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-search']),
      autocompleteList,
      invalidInputError: false,
      noResultsError: false,
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.body['input-autocomplete'];
    const autocompleteList = await courtService.fetchAllCourts();
    if (searchInput && searchInput.length >= 3) {
      const court = await courtService.getCourtByName(searchInput);
      (court) ?
        res.redirect(`remove-list-search-results?courtId=${court.locationId}`) :
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
