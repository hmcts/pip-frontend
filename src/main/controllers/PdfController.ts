import {PipRequest} from '../models/request/PipRequest';
import { Response } from 'express';
import { SummaryOfPublicationsService } from '../service/summaryOfPublicationsService';

const publicationService = new SummaryOfPublicationsService();

export default class PdfController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query['artefactId'];
    const metadata = await publicationService.getIndivPubMetadata(artefactId, (!!req.user));
    const fileData = await publicationService.getIndivPubFile(artefactId, (!!req.user));
    if (metadata.isFlatFile) {
      console.log('this is a flatFile');
      res.set('Content-Disposition', 'inline;filename='+metadata.sourceArtefactId);
      if(metadata.sourceArtefactId.endsWith('.pdf')){
        res.set('Content-Type', 'application/pdf');
      }
      else{res.set('Content-Disposition', 'attachment;filename='+metadata.sourceArtefactId);}
      res.send(fileData);
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
