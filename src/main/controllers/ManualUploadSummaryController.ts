import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ManualUploadService } from '../service/manualUploadService';
import { FileHandlingService } from '../service/fileHandlingService';
import { UserManagementService } from '../service/userManagementService';

const manualUploadService = new ManualUploadService();
const fileHandlingService = new FileHandlingService();
const userManagementService = new UserManagementService();

export default class ManualUploadSummaryController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        formData.listTypeName = manualUploadService.getListItemName(formData.listType);

        const sensitivityMismatch = manualUploadService.isSensitivityMismatch(
            formData.listType,
            formData.classification
        );

        req.query?.error === 'true'
            ? res.render('file-upload-summary', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']),
                  fileUploadData: {
                      ...manualUploadService.formatPublicationDates(formData, false),
                  },
                  displaySensitivityMismatch: sensitivityMismatch,
                  displayError: true,
              })
            : res.render('file-upload-summary', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']),
                  displaySensitivityMismatch: sensitivityMismatch,
                  displayError: false,
                  fileUploadData: {
                      ...manualUploadService.formatPublicationDates(formData, false),
                  },
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

        if (req.query?.check === 'true') {
            res.render('file-upload-summary', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']),
                displaySensitivityMismatch: sensitivityMismatch,
                displayError: false,
                fileUploadData: {
                    ...manualUploadService.formatPublicationDates(formData, false),
                },
            });
        } else {
            const artefactId = await manualUploadService.uploadPublication({ ...formData, userEmail: userEmail }, true);

            fileHandlingService.removeFileFromRedis(req.user['userId'], formData.fileName);

            if (artefactId) {
                await userManagementService.auditAction(
                    req.user,
                    'PUBLICATION_UPLOAD',
                    `Publication with artefact id ${artefactId} successfully uploaded`
                );
                res.clearCookie('formCookie');
                res.redirect('upload-confirmation');
            } else {
                res.render('file-upload-summary', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']),
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
