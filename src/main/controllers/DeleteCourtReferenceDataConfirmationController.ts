import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {LocationService} from '../service/locationService';

const locationService = new LocationService();

export default class DeleteCourtReferenceDataConfirmationController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const locationId = req.query.locationId as unknown as number;
    if (locationId) {
      const court = await locationService.getLocationById(locationId);
      res.render('delete-court-reference-data-confirmation', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-court-reference-data-confirmation']),
        court: locationService.formatCourtValue(court),
        displayError: false,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const formData = req.body;
    const court = await locationService.getLocationById(formData.locationId  as unknown as number);
    switch (formData['delete-choice']) {
      case 'yes': {
        const response = await locationService.deleteLocationById(formData.locationId, req.user?.['userId']);
        if (response !== null && response['isExists']) {
          res.render('delete-court-reference-data-confirmation', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-court-reference-data-confirmation']),
            court: locationService.formatCourtValue(court),
            apiError: response['isExists'],
            errorMessage: response['errorMessage'],
          });
        } else if (response === null) {
          res.render('delete-court-reference-data-confirmation', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-court-reference-data-confirmation']),
            court: locationService.formatCourtValue(court),
            apiError: true,
            errorMessage: 'Unknown error when attempting to delete the court from reference data',
          });
        } else {
          res.redirect('/delete-court-reference-data-success');
        }
        break;
      }
      case 'no': {
        res.redirect('/delete-court-reference-data');
        break;
      }
      default:
        res.render('delete-court-reference-data-confirmation', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-court-reference-data-confirmation']),
          court: locationService.formatCourtValue(court),
          apiError: false,
          displayError: true,
        });
    }
  }
}
