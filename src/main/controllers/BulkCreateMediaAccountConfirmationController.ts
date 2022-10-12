import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {FileHandlingService} from '../service/fileHandlingService';
import {CreateAccountService} from '../service/createAccountService';

const createAccountService = new CreateAccountService();
const fileHandlingService = new FileHandlingService();

export default class BulkCreateMediaAccountConfirmationController {
  public get(req: PipRequest, res: Response): void {
    res.render('bulk-create-media-account-confirmation', req.i18n.getDataByLanguage(req.lng)['bulk-create-media-account-confirmation']);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const confirmed = req.body['confirmed'];
    if (!confirmed) {
      return res.render('bulk-create-media-account-confirmation', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['bulk-create-media-account-confirmation']),
        displayNoOptionError: true,
      });
    }

    if (confirmed === 'Yes') {
      //const filename = (req.cookies?.uploadFilename) ? req.cookies['uploadFilename'] : "";
      const filename = "bulkCreateUser.csv";
      const file = await fileHandlingService.readFileFromRedis(req.user['oid'], filename);
      const success = await createAccountService.bulkCreateMediaAccounts(file, filename, req.user?.['piUserId']);
      fileHandlingService.removeFile(filename);

      if (success) {
        return res.redirect('/bulk-create-media-account-confirmed');
      } else {
        return res.render('bulk-create-media-account-confirmation', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['bulk-create-media-account-confirmation']),
          displayAccountCreationError: true,
        });
      }
    } else {
      return res.redirect('/bulk-create-media-account');
    }
  }
}
