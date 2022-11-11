import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {LocationService} from '../service/locationService';
import {SummaryOfPublicationsService} from '../service/summaryOfPublicationsService';

const summaryOfPublicationsService = new SummaryOfPublicationsService();
const locationService = new LocationService();
export default class BlobViewLocationController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const locationId = req.query['locationId'];
    if (locationId) {
      const court = await locationService.getLocationById(parseInt(locationId.toString()));
      const locationName = locationService.findCourtName(court, req.lng as string, 'summary-of-publications');
      const list_of_pubs = await summaryOfPublicationsService.getPublications(parseInt(locationId.toString()), req.user?.['piUserId']);

      res.render('blob-view-publications', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['blob-view-publications']),
        list_of_pubs,
        locationName,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
