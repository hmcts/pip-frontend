import { Request, Response } from 'express';
import moment from 'moment';

export default class LiveStatusController {
  public get(req: Request, res: Response): void {
    const courtId = req.query.courtId as string;

    if (courtId !== undefined) {
      res.render('live-status', {courtName: 'CourtName', updateDateTime: moment().format('MMMM Do YYYY, h:mm a')});
    }
    else {
      res.render('error');
    }
  }
}

