import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {SubscriptionService} from '../service/subscriptionService';
import validateRendering from '../common/utils';
import {HearingService} from '../service/hearingService';

const subscriptionService = new SubscriptionService();
const hearingService = new HearingService();
export default class PendingSubscriptionsController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const searchResults = await subscriptionService.getPendingSubscriptions(req.user);
    validateRendering(searchResults,'pending-subscriptions',req, res, null);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.body['hearing-selections[]'];
    let searchResults = [];
    if (Array.isArray(searchInput)) {
      // get and collect all the hearings id in searchInput array
      for (const id of searchInput) {
        const hearing = await hearingService.getHearingsById(parseInt(id));
        if (hearing) {
          searchResults.push(hearing);
        }
      }
    }
    else {
      const hearing = await hearingService.getHearingsById(parseInt(searchInput));
      if (hearing) {
        searchResults.push(hearing);
      }
    }

    await subscriptionService.setPendingSubscriptions(searchResults, req.user);

    searchResults = await subscriptionService.getPendingSubscriptions(req.user);
    validateRendering(searchResults,'pending-subscriptions',req, res, null);
  }

  public async removeCase(req: PipRequest, res: Response): Promise<void> {
    const id = req.query['id'] as string;
    await subscriptionService.removeFromCache(parseInt(id), req.user);
    const searchResults = await subscriptionService.getPendingSubscriptions(req.user);
    validateRendering(searchResults,'pending-subscriptions',req, res, null);
  }
}
