import { Request, Response } from 'express';
import { TableService } from '../service/tableService';

export default class SubscriptionManagementController {
  public get(req: Request, res: Response): void {
    const userId = 1;
    const tableService = new TableService();
    const caseTableData = tableService.generateCaseTableRows(userId);
    const courtTableData = tableService.generateCourtTableRows(userId);
    let activeAllTab, activeCaseTab, activeCourtTab = false;
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
    res.render('subscription-management', {caseTableData, courtTableData, activeAllTab, activeCaseTab, activeCourtTab});
  }
}
