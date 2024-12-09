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

        let nonStrategicUpload = false;
        if (req.query['non-strategic'] === 'true') {
            nonStrategicUpload = true;
        }

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
        const userEmail = req.user['email'];
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};

        formData.file = await fileHandlingService.readFileFromRedis(req.user['userId'], formData.fileName);

        formData.listTypeName = manualUploadService.getListItemName(formData.listType);

        const sensitivityMismatch = manualUploadService.isSensitivityMismatch(
            formData.listType,
            formData.classification
        );

        let nonStrategicUpload = false;
        if (req.query['non-strategic'] === 'true') {
            nonStrategicUpload = true;
        }

        if (req.query?.check === 'true') {
            res.render('admin/manual-upload-summary', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-upload-summary']),
                displaySensitivityMismatch: sensitivityMismatch,
                displayError: false,
                fileUploadData: {
                    ...manualUploadService.formatPublicationDates(formData, false),
                },
            });
        } else {
            const artefactId = await manualUploadService.uploadPublication(
                { ...formData, userEmail: userEmail },
                true,
                nonStrategicUpload
            );

            fileHandlingService.removeFileFromRedis(req.user['userId'], formData.fileName);

            if (artefactId) {
                await userManagementService.auditAction(
                    req.user,
                    'PUBLICATION_UPLOAD',
                    `Publication with artefact id ${artefactId} successfully uploaded`
                );
                res.clearCookie('formCookie');
                res.redirect('manual-upload-confirmation');
            } else {
                res.render('admin/manual-upload-summary', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-upload-summary']),
                    fileUploadData: {
                        ...manualUploadService.formatPublicationDates(formData, false),
                    },
                    displaySensitivityMismatch: sensitivityMismatch,
                    displayError: true,
                });
            }
        }
    }
}
