import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { CourtService } from '../service/courtService';
import { SummaryOfPublicationsService } from '../service/summaryOfPublicationsService';
import { ManualUploadService } from '../service/manualUploadService';
import {UserService} from '../service/userService';

const courtService = new CourtService();
const publicationService = new SummaryOfPublicationsService();
const manualUploadService = new ManualUploadService();
const userService = new UserService();

export default class RemoveListSearchResultsController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const courtId = parseInt(req.query?.courtId as string);
    const userId = await userService.getPandIUserId('PI_AAD', req.user);
    courtId ?
      res.render('remove-list-search-results', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-search-results']),
        court: await courtService.getCourtById(courtId),
        removalList: manualUploadService.formatListRemovalValues(await publicationService.getPublications(courtId, userId, true)),
      }) :
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }
}
