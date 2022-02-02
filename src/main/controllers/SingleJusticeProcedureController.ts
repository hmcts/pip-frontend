import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { SjpService } from '../service/sjpService';

const sjpService = new SjpService();

export default class SingleJusticeProcedureController {
  public async get(req: PipRequest, res: Response): Promise<void> {

    const courtName = 'Single Justice Procedure';
    const casesList = await sjpService.getSJPPublications();
    res.render('summary-of-publications', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['summary-of-publications']),
      casesList,
      courtName,
    });
  }
}
