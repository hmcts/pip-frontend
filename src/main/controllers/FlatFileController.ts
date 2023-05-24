import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { PublicationService } from '../service/publicationService';
import { HttpStatusCode } from 'axios';
import { isValidList } from '../helpers/listHelper';

const publicationService = new PublicationService();

export default class FlatFileController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query['artefactId'];
        const metadata = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);
        const fileData = await publicationService.getIndividualPublicationFile(artefactId, req.user?.['userId']);

        if (isValidList(fileData, metadata) && metadata && metadata.sourceArtefactId && metadata.isFlatFile) {
            res.set('Content-Disposition', 'inline;filename=' + metadata.sourceArtefactId);
            if (metadata.sourceArtefactId.endsWith('.pdf')) {
                res.set('Content-Type', 'application/pdf');
            } else if (metadata.sourceArtefactId.endsWith('.json')) {
                res.set('Content-Type', 'application/json');
            } else {
                res.set('Content-Disposition', 'attachment;filename=' + metadata.sourceArtefactId);
            }
            res.send(fileData);
        } else if (fileData === HttpStatusCode.NotFound || metadata === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
