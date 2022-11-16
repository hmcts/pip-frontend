import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();

export default class DeleteUserConfirmationController {
  public async post(req: PipRequest, res: Response): Promise<void> {
    if (req.body?.['delete-user-confirm'] === 'yes') {
      const deleteUserResponse = await accountManagementRequests.deleteUser(req.body.user as string);
      deleteUserResponse ?
        res.render('delete-user-confirmation',
          req.i18n.getDataByLanguage(req.lng)['delete-user-confirmation']) :
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    } else {
      const hrefDeletion = '/manage-user?id=' + req.body.user as string;
      res.redirect(hrefDeletion);
    }
  }
}
