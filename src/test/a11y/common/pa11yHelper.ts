import { app } from '../../../main/app';
import * as supertest from 'supertest';
const pa11y = require('pa11y');
import { fail } from 'assert';
import { PallyIssue } from './PallyIssue';
import { Pa11yResult } from './Pa11yResult';
import console from 'console';
import process from "process";

const agent = supertest.agent(app);
const headlessBrowser = process.env.TEST_A11Y_HEADLESS ? process.env.TEST_A11Y_HEADLESS === 'true' : true;

export const testAccessibility = (path: string, parameter = '', postMethod = false, postBody = {}) => {
    test('should have no accessibility errors', done => {
        const url = buildUrl(path, parameter);
        ensurePageCallWillSucceed(url)
            .then(() => runPally(url, postMethod, postBody))
            .then((result: Pa11yResult) => {
                expectNoErrors(result.issues);
                done();
            })
            .catch((err: Error) => {
                console.error(`${url} - error: ${err}`);
                done(err);
            });
    });
};

const buildUrl = (path: string, parameter = '') => {
    return parameter ? path + parameter : path;
};

const ensurePageCallWillSucceed = async (url): Promise<void> => {
    return agent.get(url).then((res: supertest.Response) => {
        if (res.redirect) {
            throw new Error(`Call to ${url} resulted in a redirect to ${res.get('Location')}`);
        }
        if (res.serverError) {
            throw new Error(`Call to ${url} resulted in internal server error`);
        }
    });
};

const runPally = (url: string, postMethod = false, postBody = {}): Pa11yResult => {

    let options: any = {
        hideElements: '.govuk-footer__licence-logo, .govuk-header__logotype-crown',
        chromeLaunchConfig: { headless: headlessBrowser, args: ['--no-sandbox'] },
    }

    if (postMethod) {
        options = {
            ...options,
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            postData: JSON.stringify(postBody),
        }
    }

    return pa11y(agent.get(url).url, options);
};

const expectNoErrors = (messages: PallyIssue[]): void => {
    const errors = messages.filter(m => m.type === 'error');

    if (errors.length > 0) {
        const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
        fail(`There are accessibility issues: \n${errorsAsJson}\n`);
    }
};
