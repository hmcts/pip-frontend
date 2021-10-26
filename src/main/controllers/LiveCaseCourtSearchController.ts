import {  Response } from 'express';
import {CourtService} from '../service/courtService';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';

const courtService = new CourtService();

export default class LiveCaseCourtSearchController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const crownCourts = await courtService.generateAlphabetisedCrownCourtList();
    res.render('live-case-alphabet-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['live-case-alphabet-search']),
      courtList: crownCourts,
    });
  }
}
