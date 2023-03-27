import { CommonPage } from './Common.page';
import { MediaAccountApprovalPage } from './MediaAccountApproval.page';
import { MediaAccountRejectionReasonsPage } from './MediaAccountRejectionReasons.page';

const helpers = require('../Helpers/Selectors');

export class MediaAccountReviewPage extends CommonPage {
    async clickApproveApplication(): Promise<MediaAccountApprovalPage> {
        await $(helpers.MediaAccountReviewApprove).catch(() => {
            console.log(`${helpers.MediaAccountReviewApprove} not found`);
        });

        await $(helpers.MediaAccountReviewApprove).click();
        return new MediaAccountApprovalPage();
    }

    async clickRejectApplication(): Promise<MediaAccountRejectionReasonsPage> {
        await $(helpers.MediaAccountReviewReject).catch(() => {
            console.log(`${helpers.MediaAccountReviewReject} not found`);
        });

        await $(helpers.MediaAccountReviewReject).click();
        return new MediaAccountRejectionReasonsPage();
    }
}
