import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { SjpService } from '../service/sjpService';
import moment from 'moment';

const sjpService = new SjpService();

export default class SingleJusticeProcedureController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const published = moment().format('DD MMMM YYYY [at] ha');
    const lookup = new Map([
      ['DL', 'Daily List'],['PL', 'Public List'],['SL', 'Strange List'],['WL', 'Warned List'],
      ['SJP', 'Single Justice Procedure'],['FL', 'Firm List'],
    ]);
    const casesList = await sjpService.getSJPPublications();
    res.render('summary-of-publications', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['summary-of-publications']),
      casesList,
      published,
      lookup,
    });
  }
}
