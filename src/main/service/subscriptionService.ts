import moment from 'moment';
import { SubscriptionRequests } from '../resources/requests/subscriptionRequests';
import { PendingSubscriptionsFromCache } from '../resources/requests/utils/pendingSubscriptionsFromCache';
import { UserSubscriptions } from '../models/UserSubscriptions';
import {PublicationService} from './publicationService';
import {CourtService} from './courtService';
import {Court} from '../models/court';

const subscriptionRequests = new SubscriptionRequests();
const pendingSubscriptionsFromCache = new PendingSubscriptionsFromCache();
const publicationService = new PublicationService();
const courtService = new CourtService();

export class SubscriptionService {

  async getSubscriptionsByUser(userid: number): Promise<UserSubscriptions> {
    const subscriptionData = await subscriptionRequests.getUserSubscriptions(userid);
    return (subscriptionData) ? subscriptionData : {caseSubscriptions: [], courtSubscriptions: []};
  }

  async generateCaseTableRows(subscriptionDataCases): Promise<any[]> {
    const caseRows = [];

    if (subscriptionDataCases.length) {
      subscriptionDataCases.forEach((subscription) => {
        caseRows.push(
          [
            {
              text: subscription.caseName,
            },
            {
              text: subscription.caseNumber,
            },
            {
              text: moment(subscription.dateAdded).format('MMM Do YYYY'),
            },
            {
              html: `<a class='unsubscribe-action' href='delete-subscription?subscription=${subscription.subscriptionId}'>Unsubscribe</a>`,
              format: 'numeric',
            },
          ],
        );
      });
    }
    return caseRows;
  }

  async generateCourtTableRows(subscriptionDataCourts): Promise<any[]> {
    const courtRows = [];
    if (subscriptionDataCourts.length) {
      subscriptionDataCourts.forEach((subscription) => {
        courtRows.push([
          {
            text: subscription.courtName,
          },
          {
            text: moment(subscription.dateAdded).format('MMM Do YYYY'),
          },
          {
            html: `<a class='unsubscribe-action' href='delete-subscription?subscription=${subscription.subscriptionId}'>Unsubscribe</a>`,
            format: 'numeric',
          },
        ]);
      });
    }
    return courtRows;
  }

  public async unsubscribe(subscriptionId: string): Promise<object> {
    return subscriptionRequests.unsubscribe(subscriptionId);
  }

  public async handleNewSubscription(pendingSubscription, user): Promise<void> {
    const selectionList = Object.keys(pendingSubscription);
    for (const selectionName of selectionList) {
      let hearingIdsList = [];
      let courtIdsList = [];
      let caseDetailsList: object[];
      let courtDetailsList: object[];
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
          urnHearing = await publicationService.getCaseByCaseUrn(pendingSubscription[`${selectionName}`], true);
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

  public async getCaseDetails(cases): Promise<object[]> {
    const casesList = [];
    for (const caseNumber of cases) {
      const caseDetails = await publicationService.getCaseByCaseNumber(caseNumber, true);
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
          courtName: pendingSubscription.name,
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
