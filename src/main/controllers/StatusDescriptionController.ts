import { Request, Response } from 'express';
import {SearchDescriptionActions} from '../resources/actions/searchDescriptionActions';
import {InputFilterService} from '../service/inputFilterService';

export default class StatusDescriptionController {
  private generateStatusDescriptionArray(statusDescriptionList): object {
    const alphabetArray = {};
    //Firstly creates the array for the possible alphabet options
    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i);
      alphabetArray[letter] = {};
    }

    statusDescriptionList = new InputFilterService().alphabetiseResults(statusDescriptionList, 'name');

    //Then loop through each status, and add it to the list
    statusDescriptionList.forEach(item => {
      if (item.description !== '') {
        const status = item.name as string;
        alphabetArray[status.charAt(0).toUpperCase()][status] = {
          id: item.statusId,
          description: item.description,
        };
      }
    });
    return alphabetArray;
  }

  public get(req: Request, res: Response): void {
    const statusDescriptionList = new SearchDescriptionActions().getStatusDescriptionList();
    const alphabetArray = new StatusDescriptionController().generateStatusDescriptionArray(statusDescriptionList);

    res.render('status-description', {
      statusList: alphabetArray,
    });
  }
}
