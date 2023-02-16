import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/locationService';
import { SummaryOfPublicationsService } from '../service/summaryOfPublicationsService';
import { ManualUploadService } from '../service/manualUploadService';

const courtService = new LocationService();
const publicationService = new SummaryOfPublicationsService();
const manualUploadService = new ManualUploadService();

export default class RemoveListSearchResultsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const locationId = parseInt(req.query?.locationId as string);
        locationId
            ? res.render('remove-list-search-results', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-search-results']),
                  court: await courtService.getLocationById(locationId),
                  removalList: manualUploadService.formatListRemovalValues(
                      await publicationService.getPublications(locationId, req.user?.['userId'], true)
                  ),
              })
            : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
}
