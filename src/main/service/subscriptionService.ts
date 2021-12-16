import moment from 'moment';
import { SubscriptionRequests } from '../resources/requests/subscriptionRequests';
import { CaseSubscription } from '../models/caseSubscription';
import { PendingSubscriptionsFromCache } from '../resources/requests/utils/pendingSubscriptionsFromCache';
import { HearingService } from './hearingService';
import { Hearing } from '../models/hearing';
import { CourtService } from './courtService';
import { Court } from '../models/court';

const subscriptionRequests = new SubscriptionRequests();
const pendingSubscriptionsFromCache = new PendingSubscriptionsFromCache();
const hearingService = new HearingService();
const courtService = new CourtService();

export class SubscriptionService {
  generateCaseTableRows(userid: number): any[] {
    const subscriptionData = subscriptionRequests.getUserSubscriptions(userid);
    const caseRows = [];
    if (subscriptionData.caseSubscriptions.length) {
      subscriptionData.caseSubscriptions.forEach((subscription) => {
        caseRows.push(
          [
            {
              text: subscription.name,
            },
            {
              text: subscription.reference,
            },
            {
              text: moment.unix(subscription.dateAdded).format('D MMM YYYY'),
            },
            {
              html: '<a href=\'#\'>Unsubscribe</a>',
              format: 'numeric',
            },
          ],
        );
      });
    }
    return caseRows;
  }

  generateCourtTableRows(userId: number): any[] {
    const subscriptionData = subscriptionRequests.getUserSubscriptions(userId);
    const courtRows = [];
    if (subscriptionData.courtSubscriptions.length) {
      subscriptionData.courtSubscriptions.forEach((subscription) => {
        courtRows.push([
          {
            text: subscription.name,
          },
          {
            text: moment.unix(subscription.dateAdded).format('D MMM YYYY'),
          },
          {
            html: '<a href=\'#\'>Unsubscribe</a>',
            format: 'numeric',
          },
        ]);
      });
    }
    return courtRows;
  }

  public async getSubscriptionUrnDetails(urn: string): Promise<CaseSubscription> {
    const subscriptions = await subscriptionRequests.getSubscriptionByUrn(urn);

    if (subscriptions) {
      return subscriptions;
    } else {
      console.log(`Subscription with urn ${urn} does not exist`);
      return null;
    }
  }

  public async handleNewSubscription(pendingSubscription, user): Promise<void> {
    const selectionList = Object.keys(pendingSubscription);
    for (const selectionName of selectionList) {
      let hearingIdsList = [];
      let courtIdsList = [];
      let caseDetailsList: Hearing[] = [];
      let courtDetailsList: Court[] = [];
      switch (selectionName) {
        // TODO: PUB-734 not merged in yet
        case 'case-number':
          // get /hearings/case-number/
          break;
        case 'hearing-selections[]':
          // pendingSubscription.selectionName gives undefined
          Array.isArray(pendingSubscription[`${selectionName}`]) ?
            hearingIdsList = pendingSubscription[`${selectionName}`] :
            hearingIdsList.push(pendingSubscription[`${selectionName}`]);
          caseDetailsList = await this.getCaseDetails(hearingIdsList);
          // set results into cache
          await this.setPendingSubscriptions(caseDetailsList, 'cases', user.id);
          break;
        case 'court-selections[]':
          Array.isArray(pendingSubscription[`${selectionName}`]) ?
            courtIdsList = pendingSubscription[`${selectionName}`] :
            courtIdsList.push(pendingSubscription[`${selectionName}`]);
          courtDetailsList = await this.getCourtDetails(courtIdsList);
          // set results into cache
          await this.setPendingSubscriptions(courtDetailsList, 'courts', user.id);
          break;
      }
    }
  }

  public async getCaseDetails(cases): Promise<Hearing[]> {
    const casesList = [];
    for (const caseNumber of cases) {
      const caseDetails = await hearingService.getCaseByNumber(caseNumber);
      if (caseDetails) {
        casesList.push(caseDetails);
      }
    }
    return casesList;
  }

  public async getCourtDetails(courts): Promise<Court[]> {
    const courtsList = [];
    for (const courtId of courts) {
      const courtDetails = await courtService.getCourtById(courtId);
      if (courtDetails) {
        courtsList.push(courtDetails);
      }
    }
    return courtsList;
  }

  public async setPendingSubscriptions(subscriptions, subscriptionType, userId): Promise<void> {
    await pendingSubscriptionsFromCache.setPendingSubscriptions(subscriptions, subscriptionType, userId);
  }

  public async getPendingSubscriptions(userId, subscriptionType): Promise<any[]> {
    return await pendingSubscriptionsFromCache.getPendingSubscriptions(userId, subscriptionType);
  }

  public async subscribe(userId): Promise<boolean> {
    let subscribed = true;
    const casesType = 'cases';
    const courtsType = 'courts';
    const cachedCaseSubs = await pendingSubscriptionsFromCache.getPendingSubscriptions(userId, casesType);
    const cachedCourtSubs = await pendingSubscriptionsFromCache.getPendingSubscriptions(userId, courtsType);
    if (cachedCaseSubs) {
      for (const cachedCase of cachedCaseSubs) {
        const response = await subscriptionRequests.subscribe(this.createSubscriptionPayload(cachedCase, casesType, userId));
        response ? await this.removeFromCache({'case': cachedCase.caseNumber}, userId) : subscribed = response;
      }
    }
    if (cachedCourtSubs) {
      for (const cachedCourt of cachedCourtSubs) {
        const response = await subscriptionRequests.subscribe(this.createSubscriptionPayload(cachedCourt, courtsType, userId));
        response ? await this.removeFromCache({court: cachedCourt.courtId}, userId) : subscribed = response;
      }
    }
    return subscribed;
  }

  createSubscriptionPayload(pendingSubscription, subscriptionType, userId): object {
    let payload;
    switch (subscriptionType) {
      case 'courts':
        payload = {
          channel: 'API',
          searchType: 'COURT_ID',
          searchValue: pendingSubscription.courtId,
          userId,
        };
        break;
      case 'cases':
        payload = {
          channel: 'API',
          searchType: 'CASE_ID',
          searchValue: pendingSubscription.caseNumber,
          userId,
        };
        break;
      default:
        payload = {
          channel: 'API',
          searchType: '',
          searchValue: '',
          userId,
        };
        break;
    }
    return payload;
  }

  public async removeFromCache(record, userId): Promise<void> {
    return await pendingSubscriptionsFromCache.removeFromCache(record, userId);
  }
}
