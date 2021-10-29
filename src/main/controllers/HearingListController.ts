import { Response } from 'express';
import {CourtService} from '../service/courtService';
import moment from 'moment';
import {cloneDeep} from 'lodash';
import {PipRequest} from '../models/request/PipRequest';

const courtService = new CourtService();

export default class HearingListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const courtId = parseInt(req.query.courtId as string);

    //If no court ID has been supplied, then return the error page
    if (courtId) {

      const court = await courtService.getCourtById(courtId);

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
