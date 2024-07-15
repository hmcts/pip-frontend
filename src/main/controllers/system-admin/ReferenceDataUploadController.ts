import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { FileHandlingService } from '../../service/FileHandlingService';
import { uploadType } from '../../helpers/consts';

const fileHandlingService = new FileHandlingService();
export default class ReferenceDataUploadController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const formValues = {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['system-admin']['reference-data-upload']),
        };
        res.render('system-admin/reference-data-upload', formValues);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        if (req.query?.showerror === 'true') {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        } else {
            const errors = {
                fileErrors: fileHandlingService.validateFileUpload(
                    req.file,
                    req.lng,
                    'system-admin/reference-data-upload',
                    uploadType.CSV
                ),
            };

            const formValues = {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['system-admin']['reference-data-upload']),
                errors,
                formData: req.body,
            };

            if (errors.fileErrors) {
                res.render('system-admin/reference-data-upload', formValues);
            } else {
                const originalFileName = req.file['originalname'];
                const sanitisedFileName = fileHandlingService.sanitiseFileName(originalFileName);
                await fileHandlingService.storeFileIntoRedis(req.user['userId'], originalFileName, sanitisedFileName);

                req.body['fileName'] = originalFileName;
                res.cookie('formCookie', JSON.stringify(req.body), { secure: true });
                res.redirect('/reference-data-upload-summary?check=true');
            }
        }
    }
}
