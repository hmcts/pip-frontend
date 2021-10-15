import { Response } from 'express';
import { CourtService } from '../service/courtService';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';

const courtService = new CourtService();

export default class AlphabeticalSearchController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const alphabetisedList = await courtService.generateAlphabetisedCourtList();
    res.render('alphabetical-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['alphabetical-search']),
      courtList: alphabetisedList,
    });
  }
}
