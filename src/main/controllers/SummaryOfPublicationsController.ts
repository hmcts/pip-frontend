import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {LocationService} from '../service/locationService';
import {SummaryOfPublicationsService} from '../service/summaryOfPublicationsService';

const summaryOfPublicationsService = new SummaryOfPublicationsService();
const courtService = new LocationService();

export default class SummaryOfPublicationsController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    //TODO we should link this up to the reference data endpoint when it's passed
    const locationId = req.query['locationId'];
    if (locationId) {
      const court = await courtService.getLocationById(parseInt(locationId.toString()));
      const locationName = (court == null ? 'Missing Court' : court.name);
      const publications = await summaryOfPublicationsService.getPublications(parseInt(locationId.toString()), req.user?.['piUserId']);

      res.render('summary-of-publications', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['summary-of-publications']),
        publications,
        locationName,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
