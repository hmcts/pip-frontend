import {PipRequest} from '../models/request/PipRequest';
import { CourtService } from '../service/courtService';
import {cloneDeep} from 'lodash';
import { Response } from 'express';

const courtService = new CourtService();

export default class WarnedListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const courtId = req.query['courtId'];

    if (courtId && req.user) {
      const court = await courtService.getCourtById(parseInt(courtId.toString()));
      res.render('warned-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['warned-list']),
        court: court,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
