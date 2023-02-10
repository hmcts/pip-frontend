import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/locationService';
import { SubscriptionService } from '../service/subscriptionService';
import {UserManagementService} from "../service/userManagementService";

const locationService = new LocationService();
const subscriptionsService = new SubscriptionService();
const userManagementService = new UserManagementService();

export default class DeleteCourtSubscriptionConfirmationController {
    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.body;
        const court = await locationService.getLocationById(formData.locationId as unknown as number);
        if (formData['delete-choice'] == 'yes') {
          const response = await subscriptionsService.deleteLocationSubscription(
            formData.locationId,
            req.user?.['provenanceUserId']
          );
          if (response === null) {
            res.render('delete-court-subscription-confirmation', {
              ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-court-subscription-confirmation']),
              court: locationService.formatCourtValue(court),
              apiError: true,
              errorMessage: 'Unknown error when attempting to delete all the subscription for the court',
            });
          } else {
            await userManagementService.auditAction(
                req.user['userId'],
                req.user['email'],
                'DELETE_LOCATION_SUBSCRIPTION_SUCCESS',
                response.toString()
            );
            res.redirect('/delete-court-subscription-success');
          }
        } else if (formData['delete-choice'] == 'no') {
          res.redirect('/delete-court-reference-data');
        } else {
        res.render('delete-court-reference-data-confirmation', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-court-reference-data-confirmation']),
          court: locationService.formatCourtValue(court),
          apiError: false,
          displayError: true,
        });
      }
    }
}
