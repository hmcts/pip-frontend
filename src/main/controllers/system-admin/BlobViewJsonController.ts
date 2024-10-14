import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/PublicationService';
import { LocationService } from '../../service/LocationService';
import { UserManagementService } from '../../service/UserManagementService';
import { HttpStatusCode } from 'axios';
import { isValidList } from '../../helpers/listHelper';

const publicationService = new PublicationService();
const locationService = new LocationService();
const userManagementService = new UserManagementService();
export default class BlobViewJsonController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const data = await publicationService.getIndividualPublicationJson(artefactId, req.user['userId']);
        const metadata = await publicationService.getIndividualPublicationMetadata(artefactId, req.user['userId']);

        if (isValidList(data, metadata)) {
            const listTypes = publicationService.getListTypes();
            const noMatchArtefact = metadata.locationId.toString().includes('NoMatch');
            let courtName = '';
            if (!noMatchArtefact) {
                courtName = (await locationService.getLocationById(parseInt(metadata.locationId.toString()))).name;
            } else {
                courtName = 'No match artefacts';
            }

            await userManagementService.auditAction(
                req.user,
                'VIEW_BLOB_EXPLORER',
                'Requested to view artefact with id: ' + artefactId
            );

            const listUrl =
                process.env.FRONTEND_URL + '/' + listTypes.get(metadata.listType)?.url + '?artefactId=' + artefactId;

            const stringData = JSON.stringify(data);

            res.render('system-admin/blob-view-json', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['blob-view-json']),
                stringData,
                courtName,
                artefactId,
                metadata,
                listUrl,
                noMatchArtefact
            });
        } else if (data === HttpStatusCode.NotFound || metadata === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
