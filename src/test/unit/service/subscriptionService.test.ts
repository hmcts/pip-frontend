import { SubscriptionService } from '../../../main/service/subscriptionService';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {SubscriptionRequests} from '../../../main/resources/requests/subscriptionRequests';

const subscriptionService = new SubscriptionService();

const stubUserSubscription = sinon.stub(SubscriptionRequests.prototype, 'getUserSubscriptions');
const rawData2 = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/userSubscriptions.json'), 'utf-8');
const subscriptionResult2 = JSON.parse(rawData2);
const userIdWithSubscriptions = 1;
const userIdWithoutSubscriptions = 2;

stubUserSubscription.withArgs(userIdWithSubscriptions).returns(subscriptionResult2.results[0]);
stubUserSubscription.withArgs(userIdWithoutSubscriptions).returns(subscriptionResult2.results[1]);
describe('generate rows functions without subscriptions', () => {

  it('generateCaseTableRows should return list of case subscriptions', async () => {
    const caseSubscriptionRows = await subscriptionService.generateSubscriptionsTableRows(userIdWithoutSubscriptions);
    expect(caseSubscriptionRows.cases.length).toBe(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', async () => {
    const courtSubscriptionRows = await subscriptionService.generateSubscriptionsTableRows(userIdWithoutSubscriptions);
    expect(courtSubscriptionRows.courts.length).toBe(0);
  });
});

describe('generate rows functions with subscriptions', () => {
  it('generateCaseTableRows should return list of case subscriptions', async () => {
    const caseSubscriptionRows = await subscriptionService.generateSubscriptionsTableRows(userIdWithSubscriptions);
    expect(caseSubscriptionRows.cases.length).toBeGreaterThan(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', async () => {
    const courtSubscriptionRows = await subscriptionService.generateSubscriptionsTableRows(userIdWithSubscriptions);
    expect(courtSubscriptionRows.courts.length).toBeGreaterThan(0);
  });

});
