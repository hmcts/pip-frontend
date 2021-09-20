import { Request, Response } from 'express';
import moment from 'moment';
import { LiveCasesActions } from '../resources/actions/liveCaseActions';

export default class LiveStatusController {
  public get(req: Request, res: Response): void {
    const courtId = req.query.courtId as string;
    const timerMilliseconds = process.env.REFRESH_TIME_MILLISECONDS ? process.env.REFRESH_TIME_MILLISECONDS : 15000;

    if (courtId !== undefined) {
      const liveCases = new LiveCasesActions().getLiveCases(parseInt(courtId));
      if (liveCases) {
        res.render('live-status', {
          courtName: liveCases.courtName,
          updateDateTime: moment.unix(liveCases.lastUpdated).format('MMMM Do YYYY, h:mm a'),
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

