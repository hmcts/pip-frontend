import {PipRequest} from '../models/request/PipRequest';
import { Response } from 'express';
import { SubscriptionService } from '../service/subscriptionService';
import {cloneDeep} from 'lodash';

const subscriptionService = new SubscriptionService();

export default class SubscriptionManagementController {

  public get(req: PipRequest, res: Response): void {
    console.log('We made it into subscription management');
    const caseTableData = subscriptionService.generateCaseTableRows(1);
    const courtTableData = subscriptionService.generateCourtTableRows(1);
    let activeAllTab = false, activeCaseTab = false, activeCourtTab = false;
    switch (Object.keys(req.query)[0]) {
      case 'all':
        activeAllTab = true;
        break;
      case 'case':
        activeCaseTab = true;
        break;
      case 'court':
        activeCourtTab = true;
        break;
      default:
        activeAllTab = true;
        break;
    }
    res.render('subscription-management', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-management']),
      caseTableData,
      courtTableData,
      activeAllTab,
      activeCaseTab,
      activeCourtTab});
  }
}
