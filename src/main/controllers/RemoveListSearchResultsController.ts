import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/LocationService';
import { SummaryOfPublicationsService } from '../service/SummaryOfPublicationsService';
import { ManualUploadService } from '../service/ManualUploadService';

const courtService = new LocationService();
const summaryOfPublicationsService = new SummaryOfPublicationsService();
const manualUploadService = new ManualUploadService();

export default class RemoveListSearchResultsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const locationId = parseInt(req.query?.locationId as string);
        const noOptionSelectedError = req.query?.error;
        locationId
            ? res.render('remove-list-search-results', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-search-results']),
                  court: await courtService.getLocationById(locationId),
                  removalList: manualUploadService.formatListRemovalValues(
                      await summaryOfPublicationsService.getPublications(locationId, req.user?.['userId'], true)
                  ),
                  noOptionSelectedError: noOptionSelectedError,
              })
            : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        if (req.user) {
            if (req.body.courtLists == undefined) {
                res.redirect(`remove-list-search-results?locationId=${req.body.locationId}&error=true`);
            } else {
                res.cookie('formCookie', JSON.stringify(req.body), { secure: true });
                res.redirect('/remove-list-confirmation');
            }
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
