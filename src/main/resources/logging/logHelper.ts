import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('applications');

export class LogHelper {
    /**
     * Method that writes the log in the standard format.
     * @param actioningUserEmail The email of the user performing the request.
     * @param userAction The action that is being performed.
     * @param actionValue Log message associated with the action
     */
    public writeLog(actioningUserEmail, userAction, actionValue) {
        const currentDateTime = new Date();
        logger.info(`Track: ${actioningUserEmail}, ${userAction} ${actionValue}, at ${currentDateTime}`);
    }

    public logErrorResponse(error, requestAction): void {
        if (error.response) {
            logger.error(`Failed to ${requestAction} on response. ${error.response.data}`);
        } else {
            logger.error(`Failed to ${requestAction} with message. ${error.message}`);
        }
    }
}
