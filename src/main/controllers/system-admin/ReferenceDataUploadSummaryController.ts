import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { FileHandlingService } from '../../service/FileHandlingService';
import { ManualUploadService } from '../../service/ManualUploadService';
import { UserManagementService } from '../../service/UserManagementService';

const manualUploadService = new ManualUploadService();
const fileHandlingService = new FileHandlingService();
const userManagementService = new UserManagementService();

export default class ReferenceDataUploadSummaryController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        req.query?.error === 'true'
            ? res.render('system-admin/reference-data-upload-summary', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['reference-data-upload-summary']),
                  displayError: true,
                  fileUploadData: formData,
              })
            : res.render('system-admin/reference-data-upload-summary', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['reference-data-upload-summary']),
                  displayError: false,
                  fileUploadData: formData,
              });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};

        formData.file = await fileHandlingService.readFileFromRedis(req.user['userId'], formData.fileName);

        if (req.query?.check === 'true') {
            res.render('system-admin/reference-data-upload-summary', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['reference-data-upload-summary']),
                displayError: false,
                fileUploadData: formData,
            });
        } else {
            const response = await manualUploadService.uploadLocationDataPublication({
                ...formData,
            });

            await userManagementService.auditAction(
                req.user,
                'REFERENCE_DATA_UPLOAD',
                'Upload of the reference data requested'
            );

            fileHandlingService.removeFileFromRedis(req.user['userId'], formData.fileName);

            if (response) {
                if (typeof response === 'string') {
                    res.render('system-admin/reference-data-upload-summary', {
                        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['reference-data-upload-summary']),
                        fileUploadData: formData,
                        displayError: true,
                        errorMessage: response,
                    });
                } else {
                    await userManagementService.auditAction(
                        req.user,
                        'REFERENCE_DATA_UPLOAD',
                        'Reference data successfully uploaded'
                    );
                    res.clearCookie('formCookie');
                    res.redirect('reference-data-upload-confirmation');
                }
            } else {
                res.render('system-admin/reference-data-upload-summary', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['reference-data-upload-summary']),
                    fileUploadData: formData,
                    displayError: true,
                });
            }
        }
    }
}
