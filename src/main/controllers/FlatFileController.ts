import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {PublicationService} from '../service/publicationService';
import {UserService} from '../service/userService';

const publicationService = new PublicationService();
const userService = new UserService();

export default class FlatFileController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query['artefactId'];
    const userId = await userService.getPandIUserId('PI_AAD', req.user);
    const metadata = await publicationService.getIndividualPublicationMetadata(artefactId, userId);
    const fileData = await publicationService.getIndividualPublicationFile(artefactId, userId);
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
