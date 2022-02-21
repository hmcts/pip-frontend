import {PipRequest} from '../models/request/PipRequest';
import { Response } from 'express';
import { PublicationService } from '../service/publicationService';

const publicationService = new PublicationService();

export default class ListTypeController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query['artefactId'];
    const fileData = await publicationService.getIndivPubJson(artefactId, (!!req.user));
    res.set('Content-Type', 'application/json');
    res.send(fileData);
  }
}
