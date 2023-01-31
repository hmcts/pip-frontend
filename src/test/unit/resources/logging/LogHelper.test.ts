import { Logger } from '@hmcts/nodejs-logging';

const sinon = require('sinon');

describe('Write expected log statement', () => {
    it('should write expected log statement', async () => {
        function mockFunction() {
            console.log('This is a mock function, with a required body for linting');
        }

        const mockLogger = {
            info: mockFunction,
        };

        const spy = sinon.spy(mockLogger, 'info');
        sinon.stub(Logger, 'getLogger').returns(mockLogger);

        const LogHelper = require('../../../../main/resources/logging/logHelper');
        const logHelper = new LogHelper.LogHelper();

        logHelper.writeLog('a@b.com', 'APPROVED_ACTION', '1234');

        expect(spy.calledOnce).toBeTruthy();
        expect(spy.args[0][0]).toContain('Track: a@b.com, APPROVED_ACTION 1234, at');
    });
});
