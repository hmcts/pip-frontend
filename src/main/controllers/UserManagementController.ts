import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {UserManagementService} from '../service/userManagementService';

const userManagementService = new UserManagementService();
export default class UserManagementController {
  public async get(req: PipRequest, res: Response): Promise<void> {

    const pageData = await userManagementService.getFormattedData(parseInt(
      <string>req.query.page) || 1,
      req.query?.email as string || '' ,
      req.query?.userId as string || '',
      req.query?.userProvenanceId as string || '',
      req.query?.roles as string || '',
      req.query?.provenances as string || '',
    );

    const formValues = {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['user-management']),
      header: userManagementService.getTableHeaders(),
      userData: pageData['userData'],
      paginationData: pageData['paginationData'],
      emailFieldData: pageData['emailFieldData'],
      userIdFieldData: pageData['userIdFieldData'],
      userProvenanceIdFieldData: pageData['userProvenanceIdFieldData'],
      provenancesFieldData: pageData['provenancesFieldData'],
      rolesFieldData: pageData['rolesFieldData'],
    };
    res.render('user-management', formValues);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const filterValues = userManagementService.generateFilterKeyValues(req.body);
    res.redirect(`user-management?${filterValues}`);
  }
}
