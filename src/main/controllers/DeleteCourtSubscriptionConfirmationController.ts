import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/locationService';
import { SubscriptionService } from '../service/subscriptionService';

const locationService = new LocationService();
const subscriptionsService = new SubscriptionService();

export default class DeleteCourtSubscriptionConfirmationController {
    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.body;
        const court = await locationService.getLocationById(formData.locationId as unknown as number);
        switch (formData['delete-choice']) {
            case 'yes': {
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
                    res.redirect('/delete-court-subscription-success');
                }
                break;
            }
            case 'no': {
                res.redirect('/delete-court-reference-data');
                break;
            }
            default:
                res.render('delete-court-subscription-confirmation', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-court-subscription-confirmation']),
                    court: locationService.formatCourtValue(court),
                    apiError: false,
                    displayError: true,
                });
        }
    }
}
