import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';

const deleteConfirmedUrl = 'bulk-delete-subscriptions-confirmed';

export default class BulkDeleteSubscriptionsConfirmedController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    res.render(deleteConfirmedUrl, req.i18n.getDataByLanguage(req.lng)[deleteConfirmedUrl]);
  }
}
