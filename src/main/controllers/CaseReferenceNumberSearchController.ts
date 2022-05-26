import { Response } from 'express';
import {cloneDeep} from 'lodash';
import {PipRequest} from '../models/request/PipRequest';
import {PublicationService} from '../service/publicationService';
import {UserService} from '../service/userService';

const publicationService = new PublicationService();
const userService = new UserService();

export default class CaseReferenceNumberSearchController {

  public get(req: PipRequest, res: Response):  void {
    res.render('case-reference-number-search',
      req.i18n.getDataByLanguage(req.lng)['case-reference-number-search']);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.body['search-input'] as string;
    if (searchInput) {
      const userId = await userService.getPandIUserId('PI_AAD', req.user);
      const searchResults = await publicationService.getCaseByCaseNumber(searchInput, userId);
      (searchResults) ?
        res.redirect(`case-reference-number-search-results?search-input=${searchInput}`) :
        res.render('case-reference-number-search', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-reference-number-search']),
          invalidInputError: false,
          noResultsError: true,
        });
    } else {
      res.render('case-reference-number-search', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-reference-number-search']),
        invalidInputError: true,
        noResultsError: false,
      });
    }
  }
}
