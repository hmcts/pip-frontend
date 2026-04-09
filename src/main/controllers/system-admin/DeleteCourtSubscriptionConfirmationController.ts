import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../../service/LocationService';
import { SubscriptionService } from '../../service/SubscriptionService';
import { PublicationService } from '../../service/PublicationService';
import { UserManagementService } from '../../service/UserManagementService';
import * as url from 'url';

const locationService = new LocationService();
const subscriptionsService = new SubscriptionService();
const publicationService = new PublicationService();
const userManagementService = new UserManagementService();

export default class DeleteCourtSubscriptionConfirmationController {
    public async post(req: PipRequest, res: Response, page: string): Promise<void> {
        const formData = req.body;
        if (!formData) {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        } else {
            const court = await locationService.getLocationById(formData.locationId as unknown as number);
            if (formData['delete-choice'] == 'yes') {
                let response;
                let successPage;
                let action;
                if (page == 'delete-court-subscription-confirmation') {
                    response = await subscriptionsService.deleteLocationSubscription(
                        formData.locationId,
                        req.user?.['userId']
                    );
                    action = 'DELETE_LOCATION_SUBSCRIPTION_SUCCESS';
                    successPage = '/delete-court-subscription-success';
                } else {
                    response = await publicationService.deleteLocationPublication(
                        formData.locationId,
                        req.user?.['userId']
                    );
                    action = 'DELETE_LOCATION_PUBLICATION_SUCCESS';
                    successPage = '/delete-court-publication-success';
                }
                if (response === null) {
                    res.render(`system-admin/${page}`, {
                        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[page]),
                        court: locationService.formatCourtValue(court),
                        apiError: true,
                        errorMessage:
                            page == 'delete-court-subscription-confirmation'
                                ? 'Unknown error when attempting to delete all the subscriptions for the court'
                                : 'Unknown error when attempting to delete all the artefacts for the court',
                    });
                } else {
                    await userManagementService.auditAction(req.user, action, response.toString());
                    res.redirect(
                        url.format({
                            pathname: successPage,
                            query: {
                                locationId: court.locationId,
                            },
                        })
                    );
                }
            } else if (formData['delete-choice'] == 'no') {
                res.redirect('/delete-court-reference-data');
            } else {
                res.render(`system-admin/${page}`, {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[page]),
                    court: locationService.formatCourtValue(court),
                    apiError: false,
                    displayError: true,
                });
            }
        }
    }
}
