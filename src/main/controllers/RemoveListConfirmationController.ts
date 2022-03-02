import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';

const publicationService = new PublicationService();

export default class RemoveListConfirmationController {
  public get(req: PipRequest, res: Response): void {
    const artefactId = req.query.artefact;
    const courtId = req.query.court;
    (artefactId && courtId) ?
      res.render('remove-list-confirmation', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-confirmation']),
        artefactId,
        courtId,
        displayError: false,
      }) :
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const formData = req.body;
    switch (formData['remove-choice']) {
      case 'yes': {
        const response = await publicationService.removePublication(formData.artefactId);
        response ?
          res.redirect('/remove-list-success') :
          res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        break;
      }
      case 'no': {
        res.redirect(`/remove-list-summary?courtId=${formData.courtId}`);
        break;
      }
      default:
        res.render('remove-list-confirmation', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-confirmation']),
          artefactId: formData.artefactId,
          courtId: formData.courtId,
          displayError: true,
        });
    }
  }
}
