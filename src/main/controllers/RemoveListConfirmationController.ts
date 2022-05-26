import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { CourtService } from '../service/courtService';
import { PublicationService } from '../service/publicationService';
import { ManualUploadService } from '../service/manualUploadService';
import {UserService} from '../service/userService';

const publicationService = new PublicationService();
const courtService = new CourtService();
const manualUploadService = new ManualUploadService();
const userService = new UserService();

export default class RemoveListConfirmationController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefact;
    if (artefactId) {
      const userId = await userService.getPandIUserId('PI_AAD', req.user);
      const artefact = await publicationService.getIndividualPublicationMetadata(artefactId, userId, true);
      artefact.listTypeName = manualUploadService.getListItemName(artefact.listType);
      res.render('remove-list-confirmation', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-confirmation']),
        artefact,
        court: await courtService.getCourtById(artefact.courtId),
        displayError: false,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const formData = req.body;
    const userId = await userService.getPandIUserId('PI_AAD', req.user);
    const artefact = await publicationService.getIndividualPublicationMetadata(formData.artefactId, userId, true);
    switch (formData['remove-choice']) {
      case 'yes': {
        const response = await publicationService.removePublication(formData.artefactId, req.user['emails'][0]);
        response ?
          res.redirect('/remove-list-success') :
          res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        break;
      }
      case 'no': {
        res.redirect(`/remove-list-search-results?courtId=${formData.courtId}`);
        break;
      }
      default:
        artefact.listTypeName = manualUploadService.getListItemName(artefact.listType);
        res.render('remove-list-confirmation', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-confirmation']),
          artefact,
          court: await courtService.getCourtById(formData.courtId),
          displayError: true,
        });
    }
  }
}
