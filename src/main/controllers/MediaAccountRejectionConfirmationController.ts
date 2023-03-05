import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { MediaAccountApplicationService } from '../service/mediaAccountApplicationService';
import { cloneDeep } from 'lodash';

const { spawn } = require('child_process');

const url = 'media-account-rejection-confirmation';
const mediaAccountApplicationService = new MediaAccountApplicationService();

export default class MediaAccountRejectionConfirmationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        if (req.body?.applicantId) {
            const applicantData = await mediaAccountApplicationService.getApplicationById(req.body.applicantId);
            const reasons = req.body.reasons;
            return res.render(url, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[url]),
                applicantData: applicantData,
                reasons: reasons,
            });
        }
        return res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const reasons = req.query.reasons;
        const python = `import os
        print(${reasons})
        exit()`;
        const pythonProcess = spawn('python3', ['-c', python]);
        let output = '';
        pythonProcess.stdout.on('data', data => {
            output += data;
            console.log(data);
        });
        pythonProcess.on('close', code => {
            console.log(`Python process exited with code ${code}`);
            res.send(output);
        });

        // Send the output back to the client
    }
}
