import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {LocationService} from '../service/locationService';
import {PublicationService} from '../service/publicationService';

const locationService = new LocationService();
const publicationService = new PublicationService();
export default class BlobViewLocationController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const list_of_locs = await locationService.fetchAllLocations(req.lng);
    const counts = await publicationService.getCountsOfPubsPerLocation();
    if (list_of_locs && counts) {
      const dic_of_locs = new Map();
      for (const loc of list_of_locs) {
        dic_of_locs.set(
          loc.name,
          [loc.locationId, counts.get(loc.locationId)],
        );
      }
      res.render('blob-view-locations', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['blob-view-locations']),
        dic_of_locs,
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
