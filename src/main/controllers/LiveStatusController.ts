import { Request, Response } from 'express';
import { LiveHearingsActions } from '../resources/actions/liveHearingsActions';
import moment from 'moment';

export default class LiveStatusController {
  public get(req: Request, res: Response): void {
    const courtId = req.query.courtId as string;

    if (courtId !== undefined) {
      const liveCases = new LiveHearingsActions().getLiveCases(parseInt(courtId));
      if (liveCases) {
        res.render('live-status', {
          courtName: liveCases.courtName,
          updateDateTime: moment.unix(liveCases.lastUpdated).format('MMMM Do YYYY, h:mm a'),
          liveHearings: liveCases.courtUpdates,
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

