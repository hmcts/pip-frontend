import { Response } from 'express';
import {CourtService} from '../service/courtService';
import moment from 'moment';
import {cloneDeep} from 'lodash';
import {PipRequest} from '../models/request/PipRequest';

const courtService = new CourtService();
let courtIdNumber;

export default class HearingListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const courtId = parseInt(req.query.courtId as string);
    const searchInput = req.query['search-input'] as string;

    if(searchInput) {
      const searchResults = await courtService.getCourtByName(searchInput);

      if(searchResults) {
        courtIdNumber = searchResults.courtId;
      }
      else {
        res.render('error');
      }

    }
    else {
      courtIdNumber = courtId;
    }

    //If no court ID has been supplied, then return the error page
    if (courtIdNumber) {

      const court = await courtService.getCourtById(courtIdNumber);

      //Returns the error page if the court list is empty
      if (court) {
        res.render('hearing-list', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['hearing-list']),
          courtName: court.name,
          hearings: court.hearingList,
          date: moment().format('MMMM DD YYYY'),
        });
      } else {
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
      }
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }

}
