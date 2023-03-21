import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { ManualUploadService } from '../service/manualUploadService';
import { cloneDeep } from 'lodash';
import { FileHandlingService } from '../service/fileHandlingService';
import { uploadType } from '../models/consts';

const manualUploadService = new ManualUploadService();
const fileHandlingService = new FileHandlingService();
let formCookie;

export default class ManualUploadController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const listItems = await manualUploadService.buildFormData(req.lng);
        formCookie = req.cookies['formCookie'];
        const formData = formCookie ? JSON.parse(formCookie) : null;

        const formValues = {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-upload']),
            formData: formData,
            listItems,
            listTypeClassifications: manualUploadService.getSensitivityMappings(),
        };
        res.render('manual-upload', formValues);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        if (req.query?.showerror === 'true') {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        } else {
            const errors = {
                fileErrors: fileHandlingService.validateFileUpload(req.file, req.lng, 'manual-upload', uploadType.FILE),
                formErrors: await manualUploadService.validateFormFields(req.body, req.lng, 'manual-upload'),
            };

            const listItems = await manualUploadService.buildFormData(req.lng);
            const formValues = {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-upload']),
                listItems,
                errors,
                formData: req.body,
                listTypeClassifications: manualUploadService.getSensitivityMappings(),
            };

            if (errors.fileErrors || errors.formErrors) {
                res.render('manual-upload', formValues);
            } else {
                const originalFileName = req.file['originalname'];
                const sanitisedFileName = fileHandlingService.sanitiseFileName(originalFileName);

                req.body['court'] = await manualUploadService.appendlocationId(req.body['input-autocomplete'], req.lng);
                req.body['artefactType'] = 'LIST'; //Agreed on defaulting to only option available until more types become ready
                req.body['fileName'] = sanitisedFileName;
                req.body['display-from'] = manualUploadService.buildDate(req.body, 'display-date-from');
                req.body['display-to'] = manualUploadService.buildDate(req.body, 'display-date-to');
                req.body['content-date-from'] = manualUploadService.buildDate(req.body, 'content-date-from');
                if (req.body?.language) {
                    req.body['languageName'] = formValues['form'].language.find(
                        item => item.value === req.body.language
                    ).text;
                }
                if (req.body?.classification) {
                    req.body['classificationName'] = formValues['form'].classification.find(
                        item => item.value === req.body.classification
                    ).text;
                }

                await fileHandlingService.storeFileIntoRedis(req.user['userId'], originalFileName, sanitisedFileName);

                res.cookie('formCookie', JSON.stringify(req.body));
                res.redirect('/manual-upload-summary?check=true');
            }
        }
    }
}
