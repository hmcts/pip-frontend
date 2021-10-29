import { Response} from 'express';
import { FilterService } from '../service/filterService';
import { CourtService } from '../service/courtService';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { CourtRequests } from '../resources/requests/courtRequests';

const courtService = new CourtService();
const courtRequests = new CourtRequests();
const filterService = new FilterService();
const checkedFilters = {
  'jurisdiction': [],
  'region': [],
};

export default class CourtNameSearchController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    let allCourts = [];
    let courtsList: any[];

    await courtService.fetchAllCourts().then((courts) => {
      if (courts) {
        allCourts = courts;
      }
    });

    // remove filter selections
    if (req.query['clear']) {
      const clearValue = req.query['clear'];
      if (checkedFilters.jurisdiction.indexOf(clearValue) >= 0) {
        checkedFilters.jurisdiction.splice(checkedFilters.jurisdiction.indexOf(clearValue), 1);
      }

      if (checkedFilters.region.indexOf(clearValue) >= 0) {
        checkedFilters.region.splice(checkedFilters.region.indexOf(clearValue),1);
      }

      if (clearValue === 'all') {
        checkedFilters.jurisdiction = [];
        checkedFilters.region = [];
      }
    }

    const filters = filterService.getFilterValues(checkedFilters);
    if (filters.length) {
      courtsList = await courtRequests.getFilteredCourts(filters, [...checkedFilters.jurisdiction, ...checkedFilters.region]);
    } else {
      courtsList = allCourts;
    }

    const alphabeticalCourts = await courtService.generateCourtsAlphabetObject(courtsList);
    const checkBoxesComponents = [
      filterService.generateCheckboxGroup(checkedFilters.jurisdiction, 'Jurisdiction', allCourts),
      filterService.generateCheckboxGroup(checkedFilters.region, 'Region', allCourts),
    ];
    const categories = filterService.generateSelectedTags([{jurisdiction: checkedFilters.jurisdiction}, {location: checkedFilters.region}]);

    res.render('court-name-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['court-name-search']),
      alphabeticalCourts,
      checkBoxesComponents,
      categories,
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    let allCourts = [];
    let courtsList: any[];
    await courtService.fetchAllCourts().then((courts) => {
      if (courts) {
        allCourts = courts;
      }
    });

    if (req.body.jurisdiction) {
      checkedFilters.jurisdiction = Array.isArray(req.body.jurisdiction) ? req.body.jurisdiction : [req.body.jurisdiction];
    } else {
      checkedFilters.jurisdiction = [];
    }

    if (req.body.region) {
      checkedFilters.region = Array.isArray(req.body.region) ? req.body.region : [req.body.region];
    } else {
      checkedFilters.region = [];
    }

    const filters = filterService.getFilterValues(checkedFilters);
    if (filters.length) {
      courtsList = await courtRequests.getFilteredCourts(filters, [...checkedFilters.jurisdiction, ...checkedFilters.region]);
    } else {
      courtsList = allCourts;
    }

    const alphabeticalCourts = await courtService.generateCourtsAlphabetObject(courtsList);
    const checkBoxesComponents = [
      filterService.generateCheckboxGroup(checkedFilters.jurisdiction, 'Jurisdiction', allCourts),
      filterService.generateCheckboxGroup(checkedFilters.region, 'Region', allCourts),
    ];

    const categories = filterService.generateSelectedTags([{jurisdiction: checkedFilters.jurisdiction}, {location: checkedFilters.region}]);

    res.render('court-name-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['court-name-search']),
      alphabeticalCourts,
      checkBoxesComponents,
      categories,
    });
  }
}
