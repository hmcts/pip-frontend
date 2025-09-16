import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ManualUploadService } from '../../service/ManualUploadService';
import { FileHandlingService } from '../../service/FileHandlingService';
import { UserManagementService } from '../../service/UserManagementService';

const manualUploadService = new ManualUploadService();
const fileHandlingService = new FileHandlingService();
const userManagementService = new UserManagementService();

export default class ManualUploadSummaryController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        formData.listTypeName = manualUploadService.getListItemName(formData.listType);

        const nonStrategicUpload = req.query?.['non-strategic'] === 'true';

        const sensitivityMismatch = manualUploadService.isSensitivityMismatch(
            formData.listType,
            formData.classification
        );

        req.query?.error === 'true'
            ? res.render('admin/manual-upload-summary', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-upload-summary']),
                  fileUploadData: {
                      ...manualUploadService.formatPublicationDates(formData, false),
                  },
                  displaySensitivityMismatch: sensitivityMismatch,
                  displayError: true,
                  nonStrategicUpload,
              })
            : res.render('admin/manual-upload-summary', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-upload-summary']),
                  displaySensitivityMismatch: sensitivityMismatch,
                  displayError: false,
                  fileUploadData: {
                      ...manualUploadService.formatPublicationDates(formData, false),
                  },
                  nonStrategicUpload,
              });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const userId = req.user['userId'];
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};

        formData.listTypeName = manualUploadService.getListItemName(formData.listType);

        const sensitivityMismatch = manualUploadService.isSensitivityMismatch(
            formData.listType,
            formData.classification
        );

        const nonStrategicUpload = req.query?.['non-strategic'] === 'true';

        try {
            formData.file = await fileHandlingService.readFileFromRedis(userId, formData.fileName);
        } catch {
            return ManualUploadSummaryController.renderConfirmationError(
                req,
                res,
                formData,
                sensitivityMismatch,
                nonStrategicUpload
            );
        }

        if (req.query?.check === 'true') {
            res.render('admin/manual-upload-summary', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-upload-summary']),
                displaySensitivityMismatch: sensitivityMismatch,
                displayError: false,
                fileUploadData: {
                    ...manualUploadService.formatPublicationDates(formData, false),
                },
                nonStrategicUpload,
            });
        } else {
            const artefactId = await manualUploadService.uploadPublication(
                { ...formData, userId: userId },
                true,
                nonStrategicUpload
            );

            fileHandlingService.removeFileFromRedis(userId, formData.fileName);

            if (artefactId) {
                await userManagementService.auditAction(
                    req.user,
                    'PUBLICATION_UPLOAD',
                    `Publication with artefact id ${artefactId} successfully uploaded`
                );
                res.clearCookie('formCookie');
                res.redirect('manual-upload-confirmation?non-strategic=' + nonStrategicUpload);
            } else {
                ManualUploadSummaryController.renderConfirmationError(
                    req,
                    res,
                    formData,
                    sensitivityMismatch,
                    nonStrategicUpload
                );
            }
        }
    }

    private static renderConfirmationError(req, res, formData, sensitivityMismatch, nonStrategicUpload) {
        res.render('admin/manual-upload-summary', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-upload-summary']),
            fileUploadData: {
                ...manualUploadService.formatPublicationDates(formData, false),
            },
            displaySensitivityMismatch: sensitivityMismatch,
            displayError: true,
            nonStrategicUpload,
        });
    }
}
