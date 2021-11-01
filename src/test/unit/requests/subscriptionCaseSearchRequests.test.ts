import sinon from 'sinon';
import {dataManagementApi} from '../../../main/resources/requests/utils/axiosConfig';
import {SubscriptionCaseSearchRequests} from '../../../main/resources/requests/subscriptionCaseSearchRequests';
import fs from 'fs';
import path from 'path';

const subscriptionCaseSearchResults = new SubscriptionCaseSearchRequests();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionCaseList.json'), 'utf-8');
const subscriptionsCaseData = JSON.parse(rawData);
const stub = sinon.stub(dataManagementApi, 'get');

const validCaseNo = 'ABC12345';

const errorResponse = {
  response: {
    data: 'test error',
  },
};

const errorRequest = {
  request: 'test error',
};

describe(`getSubscriptionCaseDetails(${validCaseNo})`, () => {

  stub.withArgs('/hearings/case-number/ABC12345').resolves({data: subscriptionsCaseData});

  it('should return list of cases', async () => {
    return subscriptionCaseSearchResults.getSubscriptionCaseDetails(validCaseNo).then(data => {
      expect(data).toBe(subscriptionsCaseData);
    });
  });

  it('should return list of 1 case', () => {
    return subscriptionCaseSearchResults.getSubscriptionCaseDetails(validCaseNo).then(data => {
      expect((data? 1:0)).toBe(1);
    });
  });

  it('should have mocked object in the cases list', () => {
    return subscriptionCaseSearchResults.getSubscriptionCaseDetails(validCaseNo).then(data => {
      expect((data === subscriptionsCaseData) ? 1 : 0).toBe(1);
    });
  });

  it(`should have only cases for urn ${validCaseNo}`, () => {
    return subscriptionCaseSearchResults.getSubscriptionCaseDetails(validCaseNo).then(data => {
      expect((data['caseNumber'] === validCaseNo ? 1 : 0)).toBe(1);
    });
  });
});

describe('non existing subscriptions getSubscriptionCaseDetails error request', () => {
  stub.withArgs('/hearings/case-number/12345').resolves(Promise.reject(errorRequest));
  it('should return null list of subscriptions', async () => {
    const userSubscriptions = await subscriptionCaseSearchResults.getSubscriptionCaseDetails('12345');
    expect(userSubscriptions).toBe(null);
  });
});

describe('non existing subscriptions getSubscriptionCaseDetails error response', () => {
  stub.withArgs('/hearings/case-number/12345').resolves(Promise.reject(errorResponse));
  it('should return null list of subscriptions', async () => {
    const userSubscriptions = await subscriptionCaseSearchResults.getSubscriptionCaseDetails('12345');
    expect(userSubscriptions).toBe(null);
  });
});
