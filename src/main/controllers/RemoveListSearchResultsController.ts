import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/LocationService';
import { SummaryOfPublicationsService } from '../service/SummaryOfPublicationsService';
import { ManualUploadService } from '../service/ManualUploadService';
import { getListDetailsArray } from '../helpers/listHelper';

const courtService = new LocationService();
const summaryOfPublicationsService = new SummaryOfPublicationsService();
const manualUploadService = new ManualUploadService();
const bulkListRemovalConfirmationUrl = 'remove-list-confirmation';

export default class RemoveListSearchResultsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const locationId = parseInt(req.query?.locationId as string);
        locationId
            ? res.render('remove-list-search-results', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-search-results']),
                  court: await courtService.getLocationById(locationId),
                  removalList: manualUploadService.formatListRemovalValues(
                      await summaryOfPublicationsService.getPublications(locationId, req.user?.['userId'], true)
                  ),
              })
            : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const listsToDelete = RemoveListSearchResultsController.getSelectedLists(req.body);
        const locationId = req.body.locationId;
        if (req.user) {
            if (listsToDelete.length == 0) {
                res.redirect(`remove-list-search-results?locationId=${locationId}`);
            } else {
                const listData = [];
                for (const list of listsToDelete) {
                    await getListDetailsArray(list, req.user?.['userId'], listData);
                }
                res.render(bulkListRemovalConfirmationUrl, {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[bulkListRemovalConfirmationUrl]),
                    court: await courtService.getLocationById(locationId),
                    removalList: manualUploadService.formatListRemovalValues(listData),
                });
            }
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    private static getSelectedLists(body: { courtLists: any }): string[] {
        const { courtLists } = body;
        const listsToDelete = [];
        if (courtLists !== undefined) {
            RemoveListSearchResultsController.addToListsForDeletion(courtLists, listsToDelete);
        }
        return listsToDelete;
    }

    private static addToListsForDeletion(lists: any, listsToDelete: any[]): void {
        if (Array.isArray(lists)) {
            listsToDelete.push(...lists);
        } else {
            listsToDelete.push(lists);
        }
    }
}
