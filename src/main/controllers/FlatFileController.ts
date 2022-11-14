import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { PublicationService } from '../service/publicationService';

const publicationService = new PublicationService();

export default class FlatFileController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query['artefactId'];
    const metadata = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);
    const fileData = await publicationService.getIndividualPublicationFile(artefactId, req.user?.['piUserId']);
    res.set('Content-Disposition', 'inline;filename=' + metadata.sourceArtefactId);
    if (metadata.sourceArtefactId.endsWith('.pdf')) {
      res.set('Content-Type', 'application/pdf');
    } else if (metadata.sourceArtefactId.endsWith('.json')) {
      res.set('Content-Type', 'application/json');
    } else {
      res.set('Content-Disposition', 'attachment;filename=' + metadata.sourceArtefactId);
    }
    res.send(fileData);
  }
}
