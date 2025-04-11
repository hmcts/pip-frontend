import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/PublicationService';
import { LocationService } from '../../service/LocationService';
import { SubscriptionService } from '../../service/SubscriptionService';
import { UserManagementService } from '../../service/UserManagementService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const subscriptionService = new SubscriptionService();
const userManagementService = new UserManagementService();

export default class BlobViewSubscriptionResubmitConfirmationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId;
        if (artefactId) {
            const metadata = await publicationService.getIndividualPublicationMetadata(artefactId, req.user['userId']);
            const locationName = (await locationService.getLocationById(parseInt(metadata.locationId.toString()))).name;
            res.render('system-admin/blob-view-subscription-resubmit-confirmation', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['blob-view-subscription-resubmit-confirmation']),
                locationName,
                metadata,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId;
        if (artefactId) {
            const response = await subscriptionService.fulfillSubscriptions(artefactId, req.user['userId']);
            if (response) {
                await userManagementService.auditAction(
                    req.user,
                    'RESUBMIT_SUBSCRIPTION',
                    `Subscriptions for publication with artefact id ${artefactId} re-submitted successfully`
                );

                res.redirect('blob-view-subscription-resubmit-confirmed');
            } else {
                res.render('error', req.i18n.getDataByLanguage(req.lng).error);
            }
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
