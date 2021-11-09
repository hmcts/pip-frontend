import { Response } from 'express';
import moment from 'moment';
import {LiveCaseService} from '../service/liveCaseService';
import {cloneDeep} from 'lodash';
import {PipRequest} from '../models/request/PipRequest';

const liveCaseStatusService = new LiveCaseService();

export default class LiveCaseStatusController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const courtId = req.query.courtId as string;

    if (courtId !== undefined) {
      let liveCase = await liveCaseStatusService.getLiveCases(parseInt(courtId));
      if (liveCase) {
        liveCase = liveCase[0];
        res.render('live-case-status', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['live-case-status']),
          courtName: liveCase.courtName,
          updateDate: moment(Date.parse(liveCase.lastUpdated)).format('dddd D MMMM YYYY'),
          updateTime: moment(Date.parse(liveCase.lastUpdated)).format('h:mma'),
          liveCases: liveCase.courtUpdates,
          refreshTimer: process.env.REFRESH_TIMER_MILLISECONDS || 15000,
          courtId: courtId,
        });
      } else {
        res.redirect('not-found');
      }
    }
    else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}

