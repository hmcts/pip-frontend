import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {FileHandlingService} from '../service/fileHandlingService';
import {CreateAccountService} from '../service/createAccountService';

const createAccountService = new CreateAccountService();
const fileHandlingService = new FileHandlingService();

export default class BulkCreateMediaAccountConfirmationController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const formData = (req.cookies?.formCookie) ? JSON.parse(req.cookies['formCookie']) : {};
    const filename = formData['uploadFileName'];
    const fileContent = await fileHandlingService.readFileContentFromRedis(req.user['oid'], filename);
    const accounts = fileContent.split(/\r?\n/).slice(1);

    res.render('bulk-create-media-account-confirmation', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['bulk-create-media-account-confirmation']),
      accounts,
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const confirmed = req.body['confirmed'];
    const formData = (req.cookies?.formCookie) ? JSON.parse(req.cookies['formCookie']) : {};
    const filename = formData.uploadFileName;
    const fileContent = await fileHandlingService.readFileContentFromRedis(req.user['oid'], filename);
    const accounts = fileContent.split(/\r?\n/).slice(1);

    if (!confirmed) {
      return res.render('bulk-create-media-account-confirmation', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['bulk-create-media-account-confirmation']),
        accounts,
        displayNoOptionError: true,
      });
    }

    if (confirmed === 'Yes') {
      const file = await fileHandlingService.readFileFromRedis(req.user['oid'], filename);
      const success = await createAccountService.bulkCreateMediaAccounts(file, filename, req.user?.['piUserId']);
      if (success) {
        return res.redirect('/bulk-create-media-account-confirmed');
      } else {
        return res.render('bulk-create-media-account-confirmation', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['bulk-create-media-account-confirmation']),
          accounts,
          displayAccountCreationError: true,
        });
      }
    } else {
      return res.redirect('/bulk-create-media-account');
    }
  }
}
