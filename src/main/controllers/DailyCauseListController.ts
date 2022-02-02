import {Response} from 'express';
import {PipRequest} from '../models/request/PipRequest';
import { DailyCauseListService } from '../service/dailyCauseListService';
import {cloneDeep} from 'lodash';

const dailyCauseListService = new DailyCauseListService();

export default class DailyCauseListControllerController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const searchResults = await dailyCauseListService.getDailyCauseList(artefactId);
    dailyCauseListService.calculateHearingSessionTime(searchResults);

    if (searchResults) {
      res.render('daily-cause-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['daily-cause-list']),
        searchResults,
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
