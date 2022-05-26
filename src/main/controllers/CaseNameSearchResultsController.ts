import { Response} from 'express';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import {PublicationService} from '../service/publicationService';
import {UserService} from '../service/userService';

const publicationService = new PublicationService();
const userService = new UserService();

export default class CaseNameSearchResultsController {
  public async get(req: PipRequest , res: Response): Promise<void> {
    const searchQuery = req.query.search;
    if (searchQuery) {
      const userId = await userService.getPandIUserId('PI_AAD', req.user);
      const searchResults = await publicationService.getCasesByCaseName(searchQuery.toString(), userId);
      res.render('case-name-search-results', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search-results']),
        searchResults,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
