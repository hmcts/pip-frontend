import { Request, Response } from 'express';
import { HearingActions } from '../resources/actions/hearingActions';
import { CourtActions } from '../resources/actions/courtActions';
import moment from 'moment';
import {InputFilterService} from '../service/inputFilterService';

const inputFilterService = new InputFilterService();

export default class HearingListController {

  public get(req: Request, res: Response): void {
    const courtId = req.query.courtId as string;

    //If no court ID has been supplied, then return the error page
    if (courtId !== undefined) {
      const court = new CourtActions().getCourtDetails(parseInt(courtId));
      const courtList = new HearingActions().getCourtHearings(parseInt(courtId as string));

      //Returns the error page if the court list is empty
      if (court === null || courtList.length === 0) {
        res.render('error');
      } else {
        const sortedCourtList = inputFilterService.numericallySortResults(courtList, 'courtNumber');
        res.render('hearing-list', {
          courtName: court['name'],
          hearings: sortedCourtList,
          date: moment().format('MMMM DD YYYY'),
        });
      }
    } else {
      res.render('error');
    }
  }

}
