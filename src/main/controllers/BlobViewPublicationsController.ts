import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {LocationService} from '../service/locationService';
import {SummaryOfPublicationsService} from '../service/summaryOfPublicationsService';

const summaryOfPublicationsService = new SummaryOfPublicationsService();
const locationService = new LocationService();
export default class BlobViewPublicationsController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const locationId = req.query['locationId'];
    if (locationId) {
      const court = await locationService.getLocationById(parseInt(locationId.toString()));
      // reusing summary-of-pubs language file and service as this is essentially the same kind of page.
      const locationName = locationService.findCourtName(court, req.lng as string, 'summary-of-publications');
      const listOfPublications = await summaryOfPublicationsService.getPublications(parseInt(locationId.toString()), req.user?.['userId']);

      res.render('blob-view-publications', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['blob-view-publications']),
        listOfPublications: listOfPublications,
        locationName,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
