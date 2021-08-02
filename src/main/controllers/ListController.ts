import { Request, Response } from 'express';
import { HearingActions } from '../resources/actions/hearingActions';
import moment from 'moment';

export default class ListController {

  public get(req: Request, res: Response): void {

    const courtId = req.query.courtId as string;

    //If no court ID has been supplied, then return the error page
    if (courtId != undefined) {
      const courtList = new HearingActions().getCourtHearings(parseInt(courtId as string));

      //Returns the error page if the court list is empty
      if (courtList.length == 0) {
        res.render('error');
      } else {
        res.render('list', {
          courtName: 'Test Court',
          hearings: courtList,
          date: moment().format('MMMM DD YYYY'),
        });
      }
    } else {
      res.render('error');
    }
  }

}
