import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { prettyPrintJson, FormatOptions } from 'pretty-print-json';
import { LocationService } from '../service/locationService';
import { UserManagementService } from '../service/userManagementService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const userManagementService = new UserManagementService();
export default class BlobViewJsonController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query['artefactId'];
        if (artefactId) {
            const listTypes = publicationService.getListTypes();
            const options: FormatOptions = { indent: 3, lineNumbers: true, trailingComma: false };

            const data = await publicationService.getIndividualPublicationJson(
                req.query['artefactId'],
                req.user['userId']
            );

            const jsonData: string = prettyPrintJson.toHtml(data, options);

            const metadata = await publicationService.getIndividualPublicationMetadata(
                req.query['artefactId'],
                req.user['userId']
            );

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

            res.render('blob-view-json', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['blob-view-json']),
                data,
                courtName,
                artefactId,
                metadata,
                jsonData,
                listUrl,
                noMatchArtefact,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
