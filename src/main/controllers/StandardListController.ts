//TODO: This is a UAT solution only, to be removed post UAT

import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {CourtService} from '../service/courtService';

const courtService = new CourtService();

export default class StandardListController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const locationId = req.query['locationId'] as string;
    const court = await courtService.getCourtById(parseInt(locationId));
    res.render('standard-list', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['standard-list']),
      court: court,
    });
  }
}
