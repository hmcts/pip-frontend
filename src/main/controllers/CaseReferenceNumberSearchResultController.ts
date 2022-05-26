import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import {PublicationService} from '../service/publicationService';
import {UserService} from '../service/userService';

const publicationService = new PublicationService();
const userService = new UserService();

export default class CaseReferenceNumberSearchResultController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.query['search-input'] as string;
    const userId = await userService.getPandIUserId('PI_AAD', req.user);
    const searchResults = await publicationService.getCaseByCaseNumber(searchInput, userId);

    if (searchResults) {
      res.render('case-reference-number-search-results', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-reference-number-search-results']),
        searchInput,
        searchResults,
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
