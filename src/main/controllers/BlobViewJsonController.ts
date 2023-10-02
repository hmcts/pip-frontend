import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { prettyPrintJson, FormatOptions } from 'pretty-print-json';
import { LocationService } from '../service/locationService';
import { UserManagementService } from '../service/userManagementService';
import { HttpStatusCode } from "axios";
import { isValidList } from "../helpers/listHelper";

const publicationService = new PublicationService();
const locationService = new LocationService();
const userManagementService = new UserManagementService();
export default class BlobViewJsonController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const data = await publicationService.getIndividualPublicationJson(
            artefactId,
            req.user['userId']
        );
        const metadata = await publicationService.getIndividualPublicationMetadata(
            artefactId,
            req.user['userId']
        );

        if (isValidList(data, metadata) && metadata && data) {
            const listTypes = publicationService.getListTypes();
            const options: FormatOptions = { indent: 3, lineNumbers: true, trailingComma: false };
            const jsonData: string = prettyPrintJson.toHtml(data, options);
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
        } else if (data === HttpStatusCode.NotFound || metadata === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
