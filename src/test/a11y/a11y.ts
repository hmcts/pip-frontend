import { fail } from 'assert';

const pa11y = require('pa11y');
import * as supertest from 'supertest';
import { app } from '../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';

import { LocationRequests } from '../../main/resources/requests/locationRequests';
import { LiveCaseRequests } from '../../main/resources/requests/liveCaseRequests';
import { CaseEventGlossaryRequests } from '../../main/resources/requests/caseEventGlossaryRequests';
import { SjpRequests } from '../../main/resources/requests/sjpRequests';
import { ManualUploadService } from '../../main/service/manualUploadService';
import { PublicationRequests } from '../../main/resources/requests/publicationRequests';
import {AccountManagementRequests} from '../../main/resources/requests/accountManagementRequests';

const agent = supertest.agent(app);
const routesNotTested = [
  '/health',
  '/health/liveness',
  '/health/readiness',
  '/info',
  '/login',
  '/cft-login',
  '/cft-login/return',
  '/cft-rejected-login',
  '/admin-login',
  '/login/return',
  '/login/admin/return',
  '/mock-login',
  '/logout',
  '/session-expired-logout',
  '/robots.txt',
  '/file-publication',
  '/media-verification',
  '/media-verification/return',
  '/user-management',
  '/manage-user',
  '/update-user',
  '/delete-user',
  '/delete-user-confirmation',
  '/update-user-confirmation',
  '/manual-reference-data-download',
];

const adminRoutes = [
  '/admin-dashboard',
  '/create-admin-account',
  '/create-admin-account-summary',
  '/manual-upload',
  '/manual-upload-summary',
  '/media-applications',
  '/upload-confirmation',
  '/media-account-review',
  '/media-account-review/image',
  '/media-account-review/approve',
  '/media-account-review/reject',
  '/media-account-approval',
  '/media-account-approval-confirmation',
  '/media-account-rejection',
  '/media-account-rejection-confirmation',
  '/remove-list-confirmation',
  '/remove-list-search',
  '/remove-list-search-results',
  '/remove-list-success',
  '/admin-management',
];

const systemAdminRoutes = [
  '/system-admin-dashboard',
  '/create-system-admin-account',
  '/create-system-admin-account-summary',
  '/manual-reference-data-upload',
  '/manual-reference-data-upload-summary',
  '/manual-reference-data-upload-confirmation',
  '/manage-third-party-users',
  '/manage-third-party-users/view',
  '/manage-third-party-users/subscriptions',
  '/blob-view-json',
  '/blob-view-publications',
  '/blob-view-locations',
  '/bulk-create-media-accounts',
  '/bulk-create-media-accounts-confirmation',
  '/bulk-create-media-accounts-confirmed',
];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/courtAndHearings.json'), 'utf-8');
const rawDataLive = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/liveCaseStatusUpdates.json'), 'utf-8');
const rawDataCaseEventGlossary = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/CaseEventGlossary.json'), 'utf-8');
const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/trimmedSJPCases.json'), 'utf-8');
const rawPublicationData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../unit/mocks/SJPMockPage.json'), 'utf-8'));
const rawMediaApplications = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/mediaApplications.json'), 'utf-8');
const allCourtData = JSON.parse(rawDataCourt);
const courtData = allCourtData[0];
const liveCaseData = JSON.parse(rawDataLive).results;
const caseEventGlossaryData = JSON.parse(rawDataCaseEventGlossary);
const sjpCases = JSON.parse(rawSJPData).results;
const mediaApplications = JSON.parse(rawMediaApplications);

sinon.stub(PublicationRequests.prototype, 'getPubsPerLocation').returns('location,count\n1,2\n3,1\n');
sinon.stub(LocationRequests.prototype, 'getLocation').returns(courtData);
sinon.stub(LocationRequests.prototype, 'getLocationByName').returns(courtData);
sinon.stub(LocationRequests.prototype, 'getFilteredCourts').returns(allCourtData);
sinon.stub(PublicationRequests.prototype, 'getPublicationsByCourt').returns(rawPublicationData);
sinon.stub(PublicationRequests.prototype, 'getIndividualPublicationJson').returns(rawPublicationData);
sinon.stub(LocationRequests.prototype, 'getAllLocations').returns(allCourtData);
sinon.stub(LiveCaseRequests.prototype, 'getLiveCases').returns(liveCaseData);
sinon.stub(CaseEventGlossaryRequests.prototype, 'getCaseEventGlossaryList').returns(caseEventGlossaryData);
sinon.stub(SjpRequests.prototype, 'getSJPCases').returns(sjpCases);
sinon.stub(ManualUploadService.prototype, 'getListItemName').returns('');
sinon.stub(AccountManagementRequests.prototype, 'getPendingMediaApplications').resolves(mediaApplications);
sinon.stub(AccountManagementRequests.prototype, 'getThirdPartyAccounts').resolves([]);

export class Pa11yResult {
  documentTitle: string;
  pageUrl: string;
  issues: PallyIssue[];
}

export class PallyIssue {
  code: string;
  context: string;
  message: string;
  selector: string;
  type: string;
  typeCode: number;
}

beforeAll((done /* call it or remove it*/) => {
  done(); // calling it
});

export function ensurePageCallWillSucceed(url: string): Promise<void> {
  if (adminRoutes.includes(url)) {
    app.request['user'] = {
      userId: '1', email: 'joe@bloggs.com', 'roles': 'INTERNAL_SUPER_ADMIN_CTSC', 'userProvenance': 'PI_AAD',
    };
  } else if (systemAdminRoutes.includes(url)) {
    app.request['user'] = {
      userId: '1', emails: ['joe@bloggs.com'], 'roles': 'SYSTEM_ADMIN',
    };
  } else {
    app.request['user'] = {
      userId: '1', email: 'joe@bloggs.com', 'roles': 'VERIFIED', 'userProvenance': 'PI_AAD'};
  }

  return agent.get(url).then((res: supertest.Response) => {
    if (res.redirect) {
      throw new Error(
        `Call to ${url} resulted in a redirect to ${res.get('Location')}`,
      );
    }
    if (res.serverError) {
      throw new Error(`Call to ${url} resulted in internal server error`);
    }
  });
}

export function runPally(url: string): Pa11yResult {
  return pa11y(url, {
    hideElements: '.govuk-footer__licence-logo, .govuk-header__logotype-crown',
  });
}

export function expectNoErrors(messages: PallyIssue[]): void {
  const errors = messages.filter(m => m.type === 'error');

  if (errors.length > 0) {
    const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    fail(`There are accessibility issues: \n${errorsAsJson}\n`);
  }
}

function removeRoutes(routes): string[] {
  const routesToTest = [];
  routes.forEach((route) => {
    if (!routesNotTested.includes(route)) {
      routesToTest.push(route);
    }
  });
  return routesToTest;
}

function readRoutes(): string[] {
  let appRoutes = app._router.stack
    .filter(r => r.route)
    .map(r => r.route.path);
  appRoutes = removeRoutes(appRoutes);
  return appRoutes;
}

function testAccessibility(url: string): void {
  describe(`Page ${url}`, () => {
    test('should have no accessibility errors', done => {
      ensurePageCallWillSucceed(url)
        .then(() => runPally(agent.get(url).url))
        .then((result: Pa11yResult) => {
          expectNoErrors(result.issues);
          done();
        })
        .catch((err: Error) => done(err));
    });
  });
}

describe('Accessibility',  () => {
  app.request['cookies'] = {
    'formCookie': JSON.stringify({'foo': 'blah', listType: '', listTypeName: ''}),
    'createAdminAccount': JSON.stringify({
      'user-role' : 'admin-ctsc',
      userRoleObject: {
        key:'admin-ctsc',
        text:'Internal - Administrator - CTSC',
        mapping:'INTERNAL_ADMIN_CTSC',
      },
    }),
  };
  readRoutes().forEach(route => {
    testAccessibility(route);
  });
});
