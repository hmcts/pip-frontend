import { Response } from 'express';
import {CourtService} from '../service/courtService';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';

const courtService = new CourtService();


export default class SearchController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const autocompleteList = await courtService.fetchAllCourts();
    res.render('search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng).search),
      autocompleteList: autocompleteList,
      invalidInputError: false,
      noResultsError: false });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.body['input-autocomplete'];
    const autocompleteList = await courtService.fetchAllCourts();
    if (searchInput && searchInput.length >= 3) {
      const court = await courtService.getCourtByName(searchInput);
      (court) ?
        res.redirect(`hearing-list?courtId=${court.courtId}`) :
        res.render('search', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng).search),
          autocompleteList: autocompleteList,
          invalidInputError: false,
          noResultsError: true});
    } else {
      res.render('search', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng).search),
        autocompleteList: autocompleteList,
        invalidInputError: true,
        noResultsError: false });
    }
  }
}
