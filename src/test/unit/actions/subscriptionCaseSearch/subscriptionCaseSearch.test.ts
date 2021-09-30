import {PipApi} from '../../../../main/utils/PipApi';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {SubscriptionCaseSearchActions} from '../../../../main/resources/actions/subscriptionCaseSearchActions';

const axios = require('axios');
jest.mock('axios');


const api = new PipApi(axios);

const validCaseNo = 'ABC12345';
const invalidCaseNo = 'DDD';

const subscriptionSearchActions = new SubscriptionCaseSearchActions(api);
const stub = sinon.stub(api, 'getSubscriptionByCaseReference');
const rawData = fs.readFileSync(path.resolve(__dirname, '../../../../main/resources/mocks/subscriptionCaseList.json'), 'utf-8');
const subscriptionsCaseData = JSON.parse(rawData);

describe(`getSubscriptionCaseDetails(${validCaseNo})`, () => {

  stub.withArgs(validCaseNo).returns(subscriptionsCaseData);

  it('should return list of cases', () => {
    return subscriptionSearchActions.getSubscriptionCaseDetails(validCaseNo).then(data => {
      expect(data).toBe(subscriptionsCaseData);
    });
  });

  it('should return list of 2 cases', () => {
    return subscriptionSearchActions.getSubscriptionCaseDetails(validCaseNo).then(data => {
      expect(data.length).toBe(1);
    });
  });

  it('should have mocked object in the cases list', () => {
    return subscriptionSearchActions.getSubscriptionCaseDetails(validCaseNo).then(data => {
      expect(data.filter(s=> s['referenceNo'] === validCaseNo).length).toBe(1);
    });
  });

  it(`should have only cases for urn ${validCaseNo}`, () => {
    return subscriptionSearchActions.getSubscriptionCaseDetails(validCaseNo).then(data => {
      expect(data.filter(s=> s['referenceNo'] === validCaseNo).length).toBe(data.length);
    });
  });
});

describe(`getSubscriptionCaseDetails(${invalidCaseNo})`, () => {

  stub.withArgs(invalidCaseNo).returns({});

  it('should return empty list as case ${invalidCaseNo}', () => {
    return subscriptionSearchActions.getSubscriptionCaseDetails(invalidCaseNo).then(data => {
      expect(data).toStrictEqual({});
    });
  });
});
