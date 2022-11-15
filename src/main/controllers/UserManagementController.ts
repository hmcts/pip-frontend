import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {UserManagementService} from '../service/userManagementService';

const userManagementService = new UserManagementService();
export default class UserManagementController {
  public async get(req: PipRequest, res: Response): Promise<void> {

    // If clear is in the query then call the handle function then redirect
    // to the page with the updated list of filter values
    if(req.query.clear) {
      const responseBody = userManagementService.handleFilterClearing(req.query);
      const filterValues = userManagementService.generateFilterKeyValues(responseBody);
      res.redirect(`user-management?${filterValues}`);
    } else {
      const pageData = await userManagementService.getFormattedData(parseInt(
        <string>req.query.page) || 1,
        req.query?.email as string || '',
        req.query?.userId as string || '',
        req.query?.userProvenanceId as string || '',
        req.query?.roles as string || '',
        req.query?.provenances as string || '',
        req.url.split('/user-management')[1],
      );

      res.render('user-management', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['user-management']),
        header: userManagementService.getTableHeaders(),
        userData: pageData['userData'],
        paginationData: pageData['paginationData'],
        emailFieldData: pageData['emailFieldData'],
        userIdFieldData: pageData['userIdFieldData'],
        userProvenanceIdFieldData: pageData['userProvenanceIdFieldData'],
        provenancesFieldData: pageData['provenancesFieldData'],
        rolesFieldData: pageData['rolesFieldData'],
        categories: pageData['categories'],
      });
    }
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const filterValues = userManagementService.generateFilterKeyValues(req.body);
    res.redirect(`user-management?${filterValues}`);
  }
}
