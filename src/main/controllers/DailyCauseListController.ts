import { Application } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import { DailyCauseListService } from '../service/dailyCauseListService';
import {cloneDeep} from 'lodash';
import moment from 'moment';

const dailyCauseListService = new DailyCauseListService();

export default class DailyCauseListControllerController {
  public async get(req: PipRequest, res: Application): Promise<void> {
    const searchResults = await dailyCauseListService.getDailyCauseList('10b6e951-2746-4fab-acad-564dcac9c58d');

    let hearingCount = 0;
    searchResults['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['sittings'].forEach(sitting => {
            sitting['duration'] = '';
            sitting['startTime'] = '';
            if(sitting['sittingStart'] !== '' && sitting['sittingEnd'] !== '') {
              const sittingStart = moment(sitting['sittingStart']);
              const sittingEnd = moment(sitting['sittingEnd']);

              const duration = moment.duration(sittingEnd.startOf('hour').diff(sittingStart.startOf('hour')));
              sitting['duration'] = duration.asHours();
              sitting['startTime'] = sittingStart.format('hhA');
            }
            hearingCount = hearingCount + sitting['hearing'].length;
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });

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
