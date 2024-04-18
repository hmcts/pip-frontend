import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/locationService';
import { SubscriptionService } from '../service/subscriptionService';
import { PublicationService } from '../service/publicationService';
import { UserManagementService } from '../service/userManagementService';

const locationService = new LocationService();
const subscriptionsService = new SubscriptionService();
const publicationService = new PublicationService();
const userManagementService = new UserManagementService();

export default class DeleteCourtSubscriptionConfirmationController {
    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.body;
        const pageToLoad = req.path.slice(1, req.path.length);
        const court = await locationService.getLocationById(formData.locationId as unknown as number);
        if (formData['delete-choice'] == 'yes') {
            let response;
            let successPage;
            let action;
            if (pageToLoad == 'delete-court-subscription-confirmation') {
                response = await subscriptionsService.deleteLocationSubscription(
                    formData.locationId,
                    req.user?.['provenanceUserId']
                );
                action = 'DELETE_LOCATION_SUBSCRIPTION_SUCCESS';
                successPage = '/delete-court-subscription-success';
            } else {
                response = await publicationService.deleteLocationPublication(
                    formData.locationId,
                    req.user?.['provenanceUserId']
                );
                action = 'DELETE_LOCATION_PUBLICATION_SUCCESS';
                successPage = '/delete-court-publication-success';
            }
            if (response === null) {
                res.render(pageToLoad, {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[pageToLoad]),
                    court: locationService.formatCourtValue(court),
                    apiError: true,
                    errorMessage:
                        pageToLoad == 'delete-court-subscription-confirmation'
                            ? 'Unknown error when attempting to delete all the subscriptions for the court'
                            : 'Unknown error when attempting to delete all the artefacts for the court',
                });
            } else {
                await userManagementService.auditAction(req.user, action, response.toString());
                res.redirect(successPage + '?locationId=' + formData.locationId);
            }
        } else if (formData['delete-choice'] == 'no') {
            res.redirect('/delete-court-reference-data');
        } else {
            res.render(pageToLoad, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[pageToLoad]),
                court: locationService.formatCourtValue(court),
                apiError: false,
                displayError: true,
            });
        }
    }
}
