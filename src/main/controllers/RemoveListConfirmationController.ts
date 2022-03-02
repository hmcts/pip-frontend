import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

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

  public post(req: PipRequest, res: Response): void {
    const formData = req.body;
    switch (formData['remove-choice']) {
      case 'yes': {
        // TODO: remove the record and redirect to confirmation on success
        res.redirect('/remove-list-success');
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
