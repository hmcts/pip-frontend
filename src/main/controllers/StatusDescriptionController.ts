import { Response } from 'express';
import { StatusDescriptionService } from '../service/statusDescriptionService';
import {cloneDeep} from 'lodash';
import {PipRequest} from '../models/request/PipRequest';

const statusDescriptionService = new StatusDescriptionService();

export default class StatusDescriptionController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const alphabetObject = await statusDescriptionService.generateStatusDescriptionObject();
    const courtId = req.query.courtId;
    res.render('status-description', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['status-description']),
      statusList: alphabetObject,
      courtId: courtId,
    });
  }
}
