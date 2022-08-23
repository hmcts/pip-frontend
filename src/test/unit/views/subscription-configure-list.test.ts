import {app} from "../../../main/app";
import request from "supertest";
import {SubscriptionRequests} from "../../../main/resources/requests/subscriptionRequests";
import sinon from 'sinon';
import fs from "fs";
import path from "path";
import {LocationService} from "../../../main/service/locationService";
import {expect} from "chai";

const PAGE_URL = '/subscription-configure-list';
const pageHeader = 'govuk-heading-l';

let htmlRes: Document;

const stubGetSubscriptions = sinon.stub(SubscriptionRequests.prototype, 'getUserSubscriptions');

describe('Subscription Configure List', () => {

  const subscriptionData = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/listTypeSubscriptions/listTypeSubscriptions.json'), 'utf-8');
  const returnedSubscriptions = JSON.parse(subscriptionData);
  stubGetSubscriptions.withArgs(1).returns(returnedSubscriptions.data);

  const locationStub = sinon.stub(LocationService.prototype, 'getLocationById');
  locationStub.withArgs(1).resolves({jurisdiction: ['Civil', 'Crime']});

  beforeAll(async () => {
    app.request['user'] = {piUserId: '1', _json: {
        'extension_UserRole': 'VERIFIED',
      }};

    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
    });
  });

  it('should have correct page title', () => {
    const pageTitle = htmlRes.title;
    expect(pageTitle).contains('Select List Types', 'Page title does not match');
  });

  it('should display the header',  () => {
    const header = htmlRes.getElementsByClassName(pageHeader);
    expect(header[0].innerHTML).contains('Select List Types', 'Could not find the header');
  });

});
