import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../../service/LocationService';
import { PublicationService } from '../../service/PublicationService';

const locationService = new LocationService();
const publicationService = new PublicationService();
export default class BlobViewLocationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const listOfLocations = await locationService.fetchAllLocations(req.lng);
        const counts = await publicationService.getCountsOfPubsPerLocation();
        if (listOfLocations && counts) {
            const dictionaryOfLocations = new Map();
            for (const loc of listOfLocations) {
                dictionaryOfLocations.set(loc.name, [loc.locationId, counts.get(String(loc.locationId))]);
            }
            dictionaryOfLocations.set('No match artefacts', ['noMatch', counts.get(String('noMatch'))]);
            res.render('system-admin/blob-view-locations', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['system-admin']['blob-view-locations']),
                dictionaryOfLocations: dictionaryOfLocations,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
