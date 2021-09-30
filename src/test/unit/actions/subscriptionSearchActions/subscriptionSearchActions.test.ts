import {PipApi} from '../../../../main/utils/PipApi';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {SubscriptionSearchActions} from '../../../../main/resources/actions/subscriptionSearchActions';


const axios = require('axios');
jest.mock('axios');


const api = new PipApi(axios);

const validUrn = '123456789';
const invalidUrn = '1232';

const subscriptionActions = new SubscriptionSearchActions(api);
const stub = sinon.stub(api, 'getSubscriptionByUrn');
const rawData = fs.readFileSync(path.resolve(__dirname, '../../../../main/resources/mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);

describe(`getSubscriptionUrnDetails(${validUrn})`, () => {

  stub.withArgs(validUrn).returns(subscriptionsData);


  it('should return list of hearings', () => {
    return subscriptionActions.getSubscriptionUrnDetails(validUrn).then(data => {
      expect(data).toBe(subscriptionsData);
    });
  });

  it('should return list of 1 subscription', () => {
    return subscriptionActions.getSubscriptionUrnDetails(validUrn).then(data => {
      expect(data.length).toBe(1);
    });
  });


  it('should have mocked object in the subscriptions list', () => {
    return subscriptionActions.getSubscriptionUrnDetails(validUrn).then(data => {
      expect(data.filter((hearings) => hearings.urn === data[0].urn).length).toBe(1);
    });
  });

  it(`should have only subscriptions for urn ${validUrn}`, () => {
    return subscriptionActions.getSubscriptionUrnDetails(validUrn).then(data => {
      expect(data.filter((hearings) => hearings.urn === validUrn).length).toBe(data.length);
    });
  });
});

describe(`getSubscriptionUrnDetails(${invalidUrn})`, () => {

  stub.withArgs(invalidUrn).returns({});


  it('should return empty list as urn ${invalidUrn}', () => {
    return subscriptionActions.getSubscriptionUrnDetails(invalidUrn).then(data => {
      expect(data).toStrictEqual({});
    });
  });

});

