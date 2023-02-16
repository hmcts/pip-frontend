import { Response } from 'express';
import { DateTime } from 'luxon';
import { LiveCaseService } from '../service/liveCaseService';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';

const liveCaseStatusService = new LiveCaseService();

export default class LiveCaseStatusController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const locationId = req.query.locationId as string;

        if (locationId !== undefined) {
            let liveCase = await liveCaseStatusService.getLiveCases(parseInt(locationId));
            if (liveCase) {
                liveCase = liveCase[0];
                res.render('live-case-status', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['live-case-status']),
                    locationName: liveCase.locationName,
                    updateDate: DateTime.fromISO(liveCase.lastUpdated, {
                        zone: 'utc',
                    }).toFormat('dd MMMM yyyy'),
                    updateTime: DateTime.fromISO(liveCase.lastUpdated, { zone: 'utc' }).toFormat('h:mma').toLowerCase(),
                    liveCases: liveCase.locationUpdates,
                    refreshTimer: process.env.REFRESH_TIMER_MILLISECONDS || 15000,
                    locationId: locationId,
                });
            } else {
                res.redirect('not-found');
            }
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
