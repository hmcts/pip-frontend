import * as supertest from 'supertest';
import { app } from '../../main/app';
import { ensurePageCallWillSucceed, expectNoErrors, Pa11yResult, runPally } from './a11y';
const agent = supertest.agent(app);

const URL = '/case-name-search';

describe('Accessibility Case Name Search Page Error States',  () => {
  test('should have no accessibility errors for no input data', done => {
    ensurePageCallWillSucceed(URL)
      .then(() => runPally(agent.post(URL).send({'case-name': ''}).url))
      .then((result: Pa11yResult) => {
        expectNoErrors(result.issues);
        done();
      }).catch((err: Error) => done(err));
  });

  test('should have no accessibility errors for invalid input data', done => {
    ensurePageCallWillSucceed(URL)
      .then(() => runPally(agent.post(URL).send({'case-name': 'foo'}).url))
      .then((result: Pa11yResult) => {
        expectNoErrors(result.issues);
        done();
      }).catch((err: Error) => done(err));
  });
});
