import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { FileHandlingService } from '../../service/FileHandlingService';
import { CreateAccountService } from '../../service/CreateAccountService';
import { UserManagementService } from '../../service/UserManagementService';

const createAccountService = new CreateAccountService();
const fileHandlingService = new FileHandlingService();
const userManagementService = new UserManagementService();

const bulkCreateAccountsConfirmationUrl = 'system-admin/bulk-create-media-accounts-confirmation';

export default class BulkCreateMediaAccountsConfirmationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        const fileName = formData.uploadFileName;

        if (fileName === undefined) {
            return res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
        const accountsToCreate = await BulkCreateMediaAccountsConfirmationController.getAccountsToCreate(
            req.user['userId'],
            fileName
        );

        res.render(bulkCreateAccountsConfirmationUrl, {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['bulk-create-media-accounts-confirmation']),
            accountsToCreate,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const confirmed = req.body['confirmed'];
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        const fileName = formData.uploadFileName;

        if (fileName == undefined) {
            return res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
        const accountsToCreate = await BulkCreateMediaAccountsConfirmationController.getAccountsToCreate(
            req.user['userId'],
            fileName
        );

        if (!confirmed) {
            return res.render(bulkCreateAccountsConfirmationUrl, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['bulk-create-media-accounts-confirmation']),
                accountsToCreate,
                displayNoOptionError: true,
            });
        }

        if (confirmed === 'Yes') {
            const file = await fileHandlingService.readFileFromRedis(req.user['userId'], fileName);
            const success = await createAccountService.bulkCreateMediaAccounts(file, fileName, req.user['userId']);
            await userManagementService.auditAction(
                req.user,
                'BULK_MEDIA_UPLOAD',
                'User uploaded a bulk list of media accounts'
            );
            if (success) {
                return res.redirect('bulk-create-media-accounts-confirmed');
            } else {
                return res.render(bulkCreateAccountsConfirmationUrl, {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['bulk-create-media-accounts-confirmation']),
                    accountsToCreate,
                    displayAccountCreationError: true,
                });
            }
        } else {
            return res.redirect('bulk-create-media-accounts');
        }
    }

    private static async getAccountsToCreate(userId, fileName): Promise<string[][]> {
        const file = await fileHandlingService.readFileFromRedis(userId, fileName);
        const fileData = fileHandlingService.readCsvToArray(file);
        return BulkCreateMediaAccountsConfirmationController.reorderFieldsInRows(fileData);
    }

    private static reorderFieldsInRows(rows): string[][] {
        const emailIndex = rows[0].indexOf('email');
        const firstNameIndex = rows[0].indexOf('firstName');
        const surnameIndex = rows[0].indexOf('surname');

        const reorderedRows = [];
        // Skipping the header and rearrange the fields in the row array to be in the order email, firstName, surname
        rows.slice(1).forEach(row => {
            const fields = [emailIndex, firstNameIndex, surnameIndex].map(i => row[i]);
            reorderedRows.push(fields);
        });
        return reorderedRows;
    }
}
