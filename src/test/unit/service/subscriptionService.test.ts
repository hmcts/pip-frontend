import { SubscriptionService } from '../../../main/service/subscriptionService';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';

const subscriptionService = new SubscriptionService();

const stubSubscriptionSearchUrn = sinon.stub(subscriptionService, 'getSubscriptionUrnDetails');
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionResult = JSON.parse(rawData);
const validUrn = '123456789';

stubSubscriptionSearchUrn.withArgs(validUrn).returns(subscriptionResult);
describe('generate rows functions without subscriptions', () => {
  it('generateCaseTableRows should return list of case subscriptions', () => {
    const caseSubscriptionRows = subscriptionService.generateCaseTableRows(2);
    expect(caseSubscriptionRows.length).toBe(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', () => {
    const courtSubscriptionRows = subscriptionService.generateCourtTableRows(2);
    expect(courtSubscriptionRows.length).toBe(0);
  });
});

describe('generate rows functions with subscriptions', () => {
  it('generateCaseTableRows should return list of case subscriptions', () => {
    const caseSubscriptionRows = subscriptionService.generateCaseTableRows(1);
    expect(caseSubscriptionRows.length).toBeGreaterThan(0);
  });

  it('generateCourtTableRows should return list of court subscriptions', () => {
    const courtSubscriptionRows = subscriptionService.generateCourtTableRows(1);
    expect(courtSubscriptionRows.length).toBeGreaterThan(0);
  });

  it('getSubscriptionUrnDetails should return the cases', () => {
    const courtSubscription= subscriptionService.getSubscriptionUrnDetails(validUrn);
    expect(courtSubscription).not.toBeNull();
  });
});

describe('unsubscribing', () => {
  // TODO: needs tests when actual api call is implemented
});
