import moment from 'moment';
import { SubscriptionRequests } from '../resources/requests/subscriptionRequests';
import { PendingSubscriptionsFromCache } from '../resources/requests/utils/pendingSubscriptionsFromCache';
import { HearingService } from './hearingService';
import { Hearing } from '../models/hearing';
import { CourtService } from './courtService';
import { Court } from '../models/court';
import { Subscription } from '../models/subscription';

const subscriptionRequests = new SubscriptionRequests();
const pendingSubscriptionsFromCache = new PendingSubscriptionsFromCache();
const hearingService = new HearingService();
const courtService = new CourtService();

export class SubscriptionService {
  public async generateSubscriptionsTableRows(userid: number): Promise<any> {
    const subscriptions = await subscriptionRequests.getUserSubscriptions(userid);
    const rows = {
      cases: [],
      courts: [],
    };
    if (subscriptions) {
      rows.cases = this.generateCaseTableRows(subscriptions);
      rows.courts = this.generateCourtTableRows(subscriptions);
    }

    return rows;
  }

  generateCaseTableRows(subscriptions: Subscription[]): any[] {
    const caseRows = [];
    if (subscriptions.length) {
      subscriptions.forEach((subscription) => {
        if (subscription.caseSubscriptions.length) {
          subscription.caseSubscriptions.forEach((caseSubscription) => {
            caseRows.push(
              [
                {
                  text: caseSubscription.caseName,
                },
                {
                  text: caseSubscription.caseNumber,
                },
                {
                  text: moment(subscription.createdDate).format('D MMM YYYY'),
                },
                {
                  html: '<a href=\'#\'>Unsubscribe</a>',
                  format: 'numeric',
                },
              ],
            );
          });
        }
      });
    }
    return caseRows;
  }

  private generateCourtTableRows(subscriptions: Subscription[]): any[] {
    const courtRows = [];
    if (subscriptions.length) {
      subscriptions.forEach((subscription) => {
        if (subscription.courtSubscriptions.length) {
          subscription.courtSubscriptions.forEach((courtSubscription) => {
            courtRows.push([
              {
                text: courtSubscription.name,
              },
              {
                text: moment(subscription.createdDate).format('D MMM YYYY'),
              },
              {
                html: '<a href=\'#\'>Unsubscribe</a>',
                format: 'numeric',
              },
            ]);
          });
        }
      });
    }
    return courtRows;
  }

  public async getSubscriptionUrnDetails(urn: string): Promise<Hearing> {
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
      let urnHearing;
      switch (selectionName) {
        case 'case-number':
        case 'hearing-selections[]':
          // pendingSubscription.selectionName gives undefined
          Array.isArray(pendingSubscription[`${selectionName}`]) ?
            hearingIdsList = pendingSubscription[`${selectionName}`] :
            hearingIdsList.push(pendingSubscription[`${selectionName}`]);
          caseDetailsList = await this.getCaseDetails(hearingIdsList);
          // set results into cache
          await this.setPendingSubscriptions(caseDetailsList, 'cases', user.id);
          break;
        case 'urn':
          urnHearing = await subscriptionRequests.getSubscriptionByUrn(pendingSubscription[`${selectionName}`]);
          if (urnHearing) {
            urnHearing.urnSearch = true;
            await this.setPendingSubscriptions([urnHearing], 'cases', user.id);
          }
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
          channel: 'EMAIL',
          searchType: 'COURT_ID',
          searchValue: pendingSubscription.courtId,
          userId,
        };
        break;
      case 'cases':
        payload = {
          channel: 'EMAIL',
          searchType: pendingSubscription.urnSearch ? 'CASE_URN' : 'CASE_ID',
          searchValue: pendingSubscription.urnSearch ? pendingSubscription.urn : pendingSubscription.caseNumber,
          caseNumber: pendingSubscription.caseNumber,
          caseName: pendingSubscription.caseName,
          urn: pendingSubscription.urn,
          userId,
        };
        break;
      default:
        payload = {
          channel: 'EMAIL',
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
