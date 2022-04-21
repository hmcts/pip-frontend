import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { CourtService } from '../service/courtService';
import { SummaryOfPublicationsService } from '../service/summaryOfPublicationsService';
import { ManualUploadService } from '../service/manualUploadService';

const courtService = new CourtService();
const publicationService = new SummaryOfPublicationsService();
const manualUploadService = new ManualUploadService();

export default class RemoveListSearchResultsController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const courtId = parseInt(req.query?.courtId as string);
    courtId ?
      res.render('remove-list-search-results', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-search-results']),
        court: await courtService.getCourtById(courtId),
        removalList: manualUploadService.formatListRemovalValues(await publicationService.getPublications(courtId, !!req.user, true)),
      }) :
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }
}
