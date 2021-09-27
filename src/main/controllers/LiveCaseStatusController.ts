import { Request, Response } from 'express';
import moment from 'moment';
import { LiveCasesActions } from '../resources/actions/liveCaseActions';

export default class LiveCaseStatusController {
  public get(req: Request, res: Response): void {
    const courtId = req.query.courtId as string;
    const timerMilliseconds = process.env.REFRESH_TIME_MILLISECONDS;

    if (courtId !== undefined) {
      const liveCases = new LiveCasesActions().getLiveCases(parseInt(courtId));
      if (liveCases) {
        res.render('live-case-status', {
          courtName: liveCases.courtName,
          updateDateTime: moment.unix(liveCases.lastUpdated).format('dddd D MMMM YYYY\xa0\xa0\xa0\xa0h:mma'),
          liveCases: liveCases.courtUpdates,
          refreshTimer: timerMilliseconds,
        });
      } else {
        res.redirect('not-found');
      }
    }
    else {
      res.render('error');
    }
  }
}

