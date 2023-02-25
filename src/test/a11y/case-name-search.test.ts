import * as supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { ensurePageCallWillSucceed, expectNoErrors, Pa11yResult, runPally } from './a11y';
import { PublicationService } from '../../main/service/publicationService';
const agent = supertest.agent(app);

const URL = '/case-name-search';

const stub = sinon.stub(PublicationService.prototype, 'getCasesByCaseName');
stub.withArgs('').returns([]);
stub.withArgs('foo').returns([]);

describe('Accessibility Case Name Search Page Error States', () => {
    test('should have no accessibility errors for no input data', done => {
        ensurePageCallWillSucceed(URL)
            .then(() => runPally(agent.post(URL).send({ 'case-name': '' }).url))
            .then((result: Pa11yResult) => {
                expectNoErrors(result.issues);
                done();
            })
            .catch((err: Error) => done(err));
    });

    test('should have no accessibility errors for invalid input data', done => {
        ensurePageCallWillSucceed(URL)
            .then(() => runPally(agent.post(URL).send({ 'case-name': 'foo' }).url))
            .then((result: Pa11yResult) => {
                expectNoErrors(result.issues);
                done();
            })
            .catch((err: Error) => done(err));
    });
});
