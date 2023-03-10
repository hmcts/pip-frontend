import { infoRequestHandler } from '@hmcts/info-provider';
import os from 'os';

export default class EtFortnightlyListController {
    public async get(): Promise<void> {
        infoRequestHandler({
            extraBuildInfo: {
                host: os.hostname(),
                name: 'expressjs-template',
                uptime: process.uptime(),
            },
            info: {},
        });
    }
}
