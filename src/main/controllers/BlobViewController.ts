import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {PublicationService} from '../service/publicationService';
import {cloneDeep} from 'lodash';

const publicationService = new PublicationService();

export default class BlobViewController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query['artefactId'];
    const metadata = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);
    res.render('blobview', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng).blobview),
      metadata,
    });
  }
}
