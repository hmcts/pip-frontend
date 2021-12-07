import { SubscriptionService } from '../../../main/service/subscriptionService';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {SubscriptionRequests} from '../../../main/resources/requests/subscriptionRequests';

const subscriptionService = new SubscriptionService();

const stubSubscriptionSearchUrn = sinon.stub(subscriptionService, 'getSubscriptionUrnDetails');
const stubUserSubscription = sinon.stub(SubscriptionRequests.prototype, 'getUserSubscriptions');
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionResult = JSON.parse(rawData);
const rawData2 = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/userSubscriptions.json'), 'utf-8');
const subscriptionResult2 = JSON.parse(rawData2);
const validUrn = '123456789';
const userIdWithSubscriptions = 1;
const userIdWithoutSubscriptions = 2;

stubSubscriptionSearchUrn.withArgs(validUrn).returns(subscriptionResult);
stubUserSubscription.withArgs(userIdWithSubscriptions).returns(subscriptionResult2.results[0]);
stubUserSubscription.withArgs(userIdWithoutSubscriptions).returns(subscriptionResult2.results[1]);
describe('generate rows functions without subscriptions', () => {

  it('generateCaseTableRows should return list of case subscriptions', async () => {
    const caseSubscriptionRows = await subscriptionService.generateCaseTableRows(userIdWithoutSubscriptions);
    expect(caseSubscriptionRows.length).toBe(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', async () => {
    const courtSubscriptionRows = await subscriptionService.generateCourtTableRows(userIdWithoutSubscriptions);
    expect(courtSubscriptionRows.length).toBe(0);
  });
});

describe('generate rows functions with subscriptions', () => {
  it('generateCaseTableRows should return list of case subscriptions', async () => {
    const caseSubscriptionRows = await subscriptionService.generateCaseTableRows(userIdWithSubscriptions);
    expect(caseSubscriptionRows.length).toBeGreaterThan(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', async () => {
    const courtSubscriptionRows = await subscriptionService.generateCourtTableRows(userIdWithSubscriptions);
    expect(courtSubscriptionRows.length).toBeGreaterThan(0);
  });

  it('getSubscriptionUrnDetails should return the cases', async () => {
    const courtSubscription = await subscriptionService.getSubscriptionUrnDetails(validUrn);
    expect(courtSubscription).not.toBeNull();
  });

});
