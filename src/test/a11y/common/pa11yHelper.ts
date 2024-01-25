import {app} from "../../../main/app";
import * as supertest from "supertest";
const pa11y = require('pa11y');
import {fail} from "assert";
import {PallyIssue} from "./PallyIssue";
import {Pa11yResult} from "./Pa11yResult";
import console from "console";

const agent = supertest.agent(app);

export const testAccessibility = (path: string, parameter = '', httpMethod = 'GET', postBody = {}) => {
    test('should have no accessibility errors', done => {
        const url = buildUrl(path, parameter);
        ensurePageCallWillSucceed(url)
            .then(() => runPally(url, httpMethod, postBody))
            .then((result: Pa11yResult) => {
                expectNoErrors(result.issues);
                done();
            })
            .catch((err: Error) => {
                console.error(`${url} - error: ${err}`);
                done(err);
            });
    });
}

const buildUrl = (path: string, parameter = '') => {
    return parameter ? path + parameter : path;
};

const ensurePageCallWillSucceed = async (request): Promise<void> => {
    return agent.get(request).then((res: supertest.Response) => {
        if (res.redirect) {
            throw new Error(`Call to ${request.url} resulted in a redirect to ${res.get('Location')}`);
        }
        if (res.serverError) {
            throw new Error(`Call to ${request.url} resulted in internal server error`);
        }
    });
}

const runPally = (url: string, httpMethod = 'GET', postBody = {}): Pa11yResult => {
    const request = httpMethod === 'POST' ? agent.post(url).send(postBody) : agent.get(url);
    return pa11y(request.url, {
        hideElements: '.govuk-footer__licence-logo, .govuk-header__logotype-crown',
        chromeLaunchConfig: { headless: true, args: ['--no-sandbox'] },
    });
}

const expectNoErrors = (messages: PallyIssue[]): void => {
    const errors = messages.filter(m => m.type === 'error');

    if (errors.length > 0) {
        const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
        fail(`There are accessibility issues: \n${errorsAsJson}\n`);
    }
}
