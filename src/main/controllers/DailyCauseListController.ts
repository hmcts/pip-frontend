import {Response} from 'express';
import {PipRequest} from '../models/request/PipRequest';
import { DailyCauseListService } from '../service/dailyCauseListService';
import {cloneDeep} from 'lodash';
import moment from 'moment';

const dailyCauseListService = new DailyCauseListService();

export default class DailyCauseListControllerController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const searchResults = await dailyCauseListService.getDailyCauseList(artefactId);
    const metaData = await dailyCauseListService.getDailyCauseListMetaData(artefactId);

    if (searchResults && metaData) {
      dailyCauseListService.calculateHearingSessionTime(searchResults);

      const publishedDateTime = Date.parse(searchResults['document']['publicationDate']);

      res.render('daily-cause-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['daily-cause-list']),
        searchResults,
        contactDate: moment(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
        publishedDate: moment(publishedDateTime).format('DD MMMM YYYY'),
        publishedTime: moment(publishedDateTime).format('ha'),
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
