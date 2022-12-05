import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/locationService';
import { PublicationService } from '../service/publicationService';
import { ManualUploadService } from '../service/manualUploadService';

const publicationService = new PublicationService();
const courtService = new LocationService();
const manualUploadService = new ManualUploadService();

export default class RemoveListConfirmationController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefact;
    if (artefactId) {
      const artefact = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId'], true);
      artefact.listTypeName = manualUploadService.getListItemName(artefact.listType);
      res.render('remove-list-confirmation', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-confirmation']),
        artefact,
        court: await courtService.getLocationById(artefact.locationId),
        displayError: false,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const formData = req.body;
    const artefact = await publicationService.getIndividualPublicationMetadata(formData.artefactId, req.user?.['userId'], true);
    switch (formData['remove-choice']) {
      case 'yes': {
        const response = await publicationService.removePublication(formData.artefactId, req.user?.['userId']);
        response ?
          res.redirect('/remove-list-success') :
          res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        break;
      }
      case 'no': {
        res.redirect(`/remove-list-search-results?locationId=${formData.locationId}`);
        break;
      }
      default:
        artefact.listTypeName = manualUploadService.getListItemName(artefact.listType);
        res.render('remove-list-confirmation', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['remove-list-confirmation']),
          artefact,
          court: await courtService.getLocationById(formData.locationId),
          displayError: true,
        });
    }
  }
}
