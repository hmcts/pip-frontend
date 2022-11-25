import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {LocationService} from '../service/locationService';

const locationService = new LocationService();

export default class DeleteCourtReferenceDataController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const courtList = await locationService.fetchAllLocations(req.lng as string);
    res.render('delete-court-reference-data', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-court-reference-data']),
      courtList: locationService.formatCourtRemovalValues(courtList)});
  }
}
