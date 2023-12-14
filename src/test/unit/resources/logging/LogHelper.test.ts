import { Logger } from '@hmcts/nodejs-logging';

const sinon = require('sinon');

const mockLogger = {
    info: () => {},
    error: () => {},
};

describe('Write expected log statement', () => {
    beforeEach(() => {
        sinon.stub(Logger, 'getLogger').returns(mockLogger);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should write expected log statement', async () => {
        const spy = sinon.spy(mockLogger, 'info');

        const LogHelper = require('../../../../main/resources/logging/logHelper');
        const logHelper = new LogHelper.LogHelper();
        logHelper.writeLog('a@b.com', 'APPROVED_ACTION', '1234');

        expect(spy.calledOnce).toBeTruthy();
        expect(spy.args[0][0]).toContain('Track: a@b.com, APPROVED_ACTION 1234, at');
    });

    it('Log error with response', async () => {
        const spy = sinon.spy(mockLogger, 'error');

        const error = {
            response: {
                data: 'Error with response',
            },
        };

        const LogHelper = require('../../../../main/resources/logging/logHelper');
        const logHelper = new LogHelper.LogHelper();
        logHelper.logErrorResponse(error, 'perform request 1');

        expect(spy.calledOnce).toBeTruthy();
        expect(spy.args[0][0]).toContain('Failed to perform request 1 on response. Error with response');
    });

    it('Log error with message', async () => {
        const spy = sinon.spy(mockLogger, 'error');

        const error = {
            message: 'Error with message',
        };

        const LogHelper = require('../../../../main/resources/logging/logHelper');
        const logHelper = new LogHelper.LogHelper();
        logHelper.logErrorResponse(error, 'perform request 2');

        expect(spy.calledOnce).toBeTruthy();
        expect(spy.args[0][0]).toContain('Failed to perform request 2 with message. Error with message');
    });
});
