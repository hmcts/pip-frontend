import { Request, Response } from 'express';
import { HearingActions } from '../resources/actions/hearingActions';
import moment from 'moment';
import {PipApi} from '../utils/PipApi';
import {CourtActions} from '../resources/actions/courtActions';

let _api: PipApi;
let courtIdNumber;
export default class HearingListController {

  constructor(private readonly api: PipApi) {
    _api = this.api;
  }

  public async get(req: Request, res: Response): Promise<void> {

    const courtId = req.query.courtId as string;
    const searchInput = req.query['search-input'];

    if(searchInput) {
      const searchResults = await new CourtActions(_api).getCourtList(searchInput);

      if(searchResults.length > 0) {
        courtIdNumber = searchResults[0].courtId;
      }
      else {
        res.render('error');
      }

    }
    else {
      courtIdNumber = parseInt(courtId);
    }


    //If no court ID has been supplied, then return the error page
    if (courtIdNumber) {

      const courtList = await new HearingActions(_api).getCourtHearings(courtIdNumber);

      //Returns the error page if the court list is empty
      if (courtList) {
        res.render('hearing-list', {
          courtName: courtList['name'],
          hearings: courtList['hearingList'],
          date: moment().format('MMMM DD YYYY'),
        });
      } else {
        res.render('error');
      }
    } else {
      res.render('error');
    }
  }

}
