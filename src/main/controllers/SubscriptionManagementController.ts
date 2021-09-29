import { Request, Response } from 'express';
import { TableService } from '../service/tableService';

export default class SubscriptionManagementController {
  userId = 1;
  tableService = new TableService();

  public get(req: Request, res: Response): void {
    const caseTableData = this.tableService.generateCaseTableRows(this.userId);
    const courtTableData = this.tableService.generateCourtTableRows(this.userId);
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
