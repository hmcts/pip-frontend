import { Response } from 'express';
import {LocationService} from '../service/locationService';
import moment from 'moment';
import {cloneDeep} from 'lodash';
import {PipRequest} from '../models/request/PipRequest';

const courtService = new LocationService();

export default class HearingListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const locationId = parseInt(req.query.locationId as string);

    //If no court ID has been supplied, then return the error page
    if (locationId) {

      const court = await courtService.getLocationById(locationId);

      //Returns the error page if the court list is empty
      if (court) {
        res.render('hearing-list', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['hearing-list']),
          courtName: court.name,
          hearings: court.hearingList,
          date: moment().format('DD MMMM YYYY'),
        });
      } else {
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
      }
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }

}
