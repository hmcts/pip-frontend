import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import {cloneDeep} from 'lodash';

const accountManagementRequests = new AccountManagementRequests();
export default class AdminManagementController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    res.render('admin-management', req.i18n.getDataByLanguage(req.lng)['admin-management']);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.body['search-input'];
    console.log('We made it here');

    if (searchInput && searchInput.length) {
      console.log('We also made it here');
      const searchResults = await accountManagementRequests.getAdminUserByEmailAndProvenance(searchInput, 'PI_AAD',
        req.user['userId']);

      console.log('We then made it here');
      console.log(searchResults);

      (searchResults) ?
        res.redirect(`manage-user?id=${searchResults.userId}`) :
        res.render('view-option', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['view-option']),
          showError: false,
        });
    } else {
      console.log('Instead me made it here');
      res.render('admin-management', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['admin-management']),
        noResultsError: true,
      });
    }
  }
}
