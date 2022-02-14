import {PipRequest} from '../models/request/PipRequest';
import { Response } from 'express';
import { SummaryOfPublicationsService } from '../service/summaryOfPublicationsService';

const publicationService = new SummaryOfPublicationsService();

export default class ListTypeController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query['artefactId'];
    const fileData = await publicationService.getIndivPubJson(artefactId, (!!req.user));
    res.set('Content-Type', 'application/json');
    res.send(fileData);
  }
}
