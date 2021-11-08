//TODO: To be deleted post UAT, this is a UAT solution only

import {PipRequest} from '../models/request/PipRequest';
import { Response } from 'express';
import {CourtService} from '../service/courtService';
import {cloneDeep} from 'lodash';

const courtService = new CourtService();

export default class ListOptionController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const courtId = req.query['courtId'];
    if (courtId) {
      if (req.isAuthenticated()) {
        const court = await courtService.getCourtById(parseInt(courtId.toString()));
        res.render('list-option', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-option']),
          court: court
        });
      } else {
        res.redirect(`hearing-list?courtId=${courtId}`);
      }
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
