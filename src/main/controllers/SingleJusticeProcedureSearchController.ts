import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { SjpService } from '../service/sjpService';

const sjpService = new SjpService();

export default class SingleJusticeProcedureSearchController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const casesList = await sjpService.getSJPCases();
    res.render('single-justice-procedure-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['single-justice-procedure-search']),
      casesList,
    });
  }
}
