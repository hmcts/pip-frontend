import * as supertest from 'supertest';
import { app } from '../../main/app';
import { ensurePageCallWillSucceed, expectNoErrors, Pa11yResult, runPally } from './a11y';
const agent = supertest.agent(app);

const URL = '/search';

describe('Accessibility Search Page Error States', () => {
  test('should have no accessibility errors for no input and invalid data', done => {
    ensurePageCallWillSucceed(URL)
      .then(() => runPally(agent.post(URL).send({ 'input-autocomplete': '' }).url))
      .then((result: Pa11yResult) => {
        expectNoErrors(result.issues);
        done();
      })
      .catch((err: Error) => done(err));
  });
});
