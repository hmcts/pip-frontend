import { Response} from 'express';
import { HearingService } from '../service/hearingService';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import {SubscriptionService} from '../service/subscriptionService';

const hearingService = new HearingService();
const subscriptionService = new SubscriptionService();

export default class CaseNameSearchResultsController {
  public async get(req: PipRequest , res: Response): Promise<void> {
    const searchQuery = req.query.search;
    if (searchQuery) {
      const searchResults = await hearingService.getHearingsByCaseName(searchQuery.toString());
      res.render('case-name-search-results', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search-results']),
        searchResults,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.body['hearing-selections[]'];
    const searchResults = [];
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
    res.redirect('pending-subscriptions');
  }
}
