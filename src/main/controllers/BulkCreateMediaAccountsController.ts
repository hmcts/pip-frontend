import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { FileHandlingService } from '../service/fileHandlingService';
import { cloneDeep } from 'lodash';
import { uploadType } from '../models/consts';
import { CreateAccountService } from '../service/createAccountService';

const fileHandlingService = new FileHandlingService();
const createAccountService = new CreateAccountService();

const bulkCreateAccountsUrl = 'bulk-create-media-accounts';
const bulkCreateAccountsConfirmationUrl = 'bulk-create-media-accounts-confirmation';

export default class BulkCreateMediaAccountsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render(bulkCreateAccountsUrl, {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[bulkCreateAccountsUrl]),
            displayError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.body;
        let error = fileHandlingService.validateFileUpload(req.file, req.lng, bulkCreateAccountsUrl, uploadType.CSV);
        if (error === null) {
            const file = fileHandlingService.readFile(req.file['originalname']);
            error = createAccountService.validateCsvFileContent(
                file,
                3,
                ['email', 'firstName', 'surname'],
                req.lng,
                'bulk-create-media-accounts'
            );
        }

        if (error === null) {
            const originalFileName = req.file['originalname'];
            const sanitisedFileName = fileHandlingService.sanitiseFileName(originalFileName);
            await fileHandlingService.storeFileIntoRedis(req.user['userId'], originalFileName, sanitisedFileName);

            formData.uploadFileName = originalFileName;
            res.cookie('formCookie', JSON.stringify(formData));
            res.redirect(bulkCreateAccountsConfirmationUrl);
        } else {
            res.render(bulkCreateAccountsUrl, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[bulkCreateAccountsUrl]),
                displayError: true,
                error,
            });
        }
    }
}
