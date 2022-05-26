import { Response} from 'express';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import {PublicationService} from '../service/publicationService';
import {UserService} from '../service/userService';

const publicationService = new PublicationService();
const userService = new UserService();

export default class CaseNameSearchController {

  public get(req: PipRequest, res: Response): void {
    if (req.query.error === 'true') {
      res.render('case-name-search', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search']),
        noResultsError: true,
      });
    } else {
      res.render('case-name-search', {...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search'])});
    }
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.body['case-name'];
    if (searchInput) {
      const userId = await userService.getPandIUserId('PI_AAD', req.user);
      const searchResults = await publicationService.getCasesByCaseName(searchInput.toLowerCase(), userId);
      if (searchResults.length) {
        res.redirect('case-name-search-results?search=' + searchInput);
      } else {
        res.render('case-name-search', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search']),
          noResultsError: true,
        });
      }
    } else {
      res.render('case-name-search', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search']),
        noResultsError: true,
      });
    }
  }
}
