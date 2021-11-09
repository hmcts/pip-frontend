import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import { Response } from 'express';

export default class WarnedListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    if (req.user) {
      res.render('warned-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['warned-list']),
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
