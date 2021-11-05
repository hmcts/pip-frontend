import { fail } from 'assert';

const pa11y = require('pa11y');
import * as supertest from 'supertest';
import { app } from '../../main/app';
import fs from 'fs';
import path from 'path';
import {CourtRequests} from '../../main/resources/requests/courtRequests';
import {LiveCaseRequests} from '../../main/resources/requests/liveCaseRequests';
import {CaseEventGlossaryRequests} from '../../main/resources/requests/caseEventGlossaryRequests';
const agent = supertest.agent(app);
import {request as expressRequest} from 'express';
import sinon from 'sinon';

const routesNotTested = [
  '/health',
  '/health/liveness',
  '/health/readiness',
  '/info',
  '/login',
  '/login/return',
];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/courtAndHearings.json'), 'utf-8');
const rawDataLive = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/liveCaseStatusUpdates.json'), 'utf-8');
const rawDataCaseEventGlossary = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/CaseEventGlossary.json'), 'utf-8');

const allCourtData = JSON.parse(rawDataCourt);
const courtData = allCourtData[0];
const liveCaseData = JSON.parse(rawDataLive).results;
const caseEventGlossaryData = JSON.parse(rawDataCaseEventGlossary);

sinon.stub(CourtRequests.prototype, 'getCourt').returns(courtData);
sinon.stub(CourtRequests.prototype, 'getCourtByName').returns(courtData);
sinon.stub(CourtRequests.prototype, 'getFilteredCourts').returns(allCourtData);
sinon.stub(CourtRequests.prototype, 'getAllCourts').returns(allCourtData);
sinon.stub(LiveCaseRequests.prototype, 'getLiveCases').returns(liveCaseData);
sinon.stub(CaseEventGlossaryRequests.prototype, 'getCaseEventGlossaryList').returns(caseEventGlossaryData);

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
  sinon.stub(expressRequest, 'isAuthenticated').returns(true);
  readRoutes().forEach(route => {
    if (route.indexOf('/api/') !== 0) {
      testAccessibility(route);
    }
  });
});
