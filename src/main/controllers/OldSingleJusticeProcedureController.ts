import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { SjpService } from '../service/sjpService';
import moment from 'moment';

const sjpService = new SjpService();

export default class OldSingleJusticeProcedureController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const published = moment().format('DD MMMM YYYY [at] ha');
    const casesList = await sjpService.getSJPCases();
    res.render('old-single-justice-procedure', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['single-justice-procedure']),
      casesList,
      published,
    });
  }
}
