import { fail } from 'assert';

const pa11y = require('pa11y');
import * as supertest from 'supertest';
import { app } from '../../main/app';
const agent = supertest.agent(app);

const routesNotTested = [
  '/health',
  '/health/liveness',
  '/health/readiness',
  '/info',
];

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
  readRoutes().forEach(route => {
    testAccessibility(route);
  });
});
