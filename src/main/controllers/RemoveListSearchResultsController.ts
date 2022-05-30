import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/locationService';
import { SummaryOfPublicationsService } from '../service/summaryOfPublicationsService';
import { ManualUploadService } from '../service/manualUploadService';
import {UserService} from '../service/userService';

const courtService = new LocationService();
const publicationService = new SummaryOfPublicationsService();
const manualUploadService = new ManualUploadService();
const userService = new UserService();

export default class RemoveListSearchResultsController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const locationId = parseInt(req.query?.locationId as string);
    const userId = await userService.getPandIUserId('PI_AAD', req.user);
    locationId ?
      res.render('remove-list-search-results', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-search-results']),
        court: await courtService.getLocationById(locationId),
        removalList: manualUploadService.formatListRemovalValues(await publicationService.getPublications(locationId, userId, true)),
      }) :
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }
}
