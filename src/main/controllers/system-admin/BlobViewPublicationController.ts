import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/PublicationService';
import { LocationService } from '../../service/LocationService';
import { UserManagementService } from '../../service/UserManagementService';
import { HttpStatusCode } from 'axios';
import { isValidList } from '../../helpers/listHelper';
import { validate } from 'uuid';
import url from 'url';

const publicationService = new PublicationService();
const locationService = new LocationService();
const userManagementService = new UserManagementService();
export default class BlobViewPublicationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId;
        const data = await publicationService.getIndividualPublicationJson(artefactId, req.user['userId'], true);
        const metadata = await publicationService.getIndividualPublicationMetadata(artefactId, req.user['userId'], true);

        if (isValidList(data, metadata)) {
            const listTypes = publicationService.getListTypes();
            const noMatchArtefact = metadata.locationId.toString().includes('NoMatch');
            const locationName = await BlobViewPublicationController.getLocationName(metadata.locationId, noMatchArtefact);

            await userManagementService.auditAction(
                req.user,
                'VIEW_BLOB_EXPLORER',
                'Requested to view artefact with id: ' + artefactId
            );

            const listUrl = process.env.FRONTEND_URL + '/'
                + (metadata.isFlatFile ? 'file-publication' : listTypes.get(metadata.listType)?.url)
                + '?artefactId=' + artefactId;

            res.render('system-admin/blob-view-publication', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['blob-view-publication']),
                data: JSON.stringify(data),
                locationName,
                artefactId,
                metadata,
                listUrl,
                noMatchArtefact,
            });
        } else if (data === HttpStatusCode.NotFound || metadata === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId;
        if (validate(artefactId)) {
            res.redirect(
                url.format({
                    pathname: 'blob-view-subscription-resubmit-confirmation',
                    query: { artefactId: artefactId as string },
                })
            );
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    private static async getLocationName(locationId, noMatchArtefact): Promise<string> {
        let locationName = '';
        if (!noMatchArtefact) {
            locationName = (await locationService.getLocationById(parseInt(locationId.toString()))).name;
        } else {
            locationName = 'No match artefacts';
        }
        return locationName;
    }
}
