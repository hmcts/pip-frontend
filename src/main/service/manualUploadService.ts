import { LocationService } from './locationService';
import { DataManagementRequests } from '../resources/requests/dataManagementRequests';
import moment from 'moment';
import { FileHandlingService } from './fileHandlingService';

const courtService = new LocationService();
const dataManagementRequests = new DataManagementRequests();
const listSubTypes = [
  {text:'SJP Public List', value: 'SJP_PUBLIC_LIST'},
  {text: 'SJP Press List', value: 'SJP_PRESS_LIST'},
  {text: 'Civil Daily Cause List', value: 'CIVIL_DAILY_CAUSE_LIST'},
  {text: 'Civil And Family Daily Cause List', value: 'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST'},
  {text: 'Family Daily Cause List', value: 'FAMILY_DAILY_CAUSE_LIST'},
  {text: 'Crown Daily List', value: 'CROWN_DAILY_LIST'},
  {text: 'Crown Firm List', value: 'CROWN_FIRM_LIST'},
  {text: 'Crown Warned List', value: 'CROWN_WARNED_LIST'},
  {text: 'Magistrates Public List', value: 'MAGS_PUBLIC_LIST'},
  {text: 'Magistrates Standard List', value: 'MAGS_STANDARD_LIST'},
];

const fileHandlingService = new FileHandlingService();

export class ManualUploadService {
  public async buildFormData(language: string): Promise<object> {
    return {
      courtList: await courtService.fetchAllLocations(language),
      listSubtypes: this.getListSubtypes(),
      judgementsOutcomesSubtypes: this.getJudgementOutcomesSubtypes(),
    };
  }

  public formatListRemovalValues(summaryList): any[] {
    const formattedList = [];
    summaryList.forEach((value) => {
      const listItem = {...value};
      listItem.listTypeName = this.getListItemName(value.listType);
      listItem.dateRange = `${moment(value.displayFrom).format('D MMM YYYY')} to ${moment(value.displayTo).format('D MMM YYYY')}`;
      formattedList.push(listItem);
    });
    return formattedList;
  }

  private getListSubtypes(): Array<object> {
    return listSubTypes;
  }

  public getListItemName(itemValue: string): string {
    return listSubTypes.find(item => item.value === itemValue).text;
  }

  private getJudgementOutcomesSubtypes(): Array<object> {
    return [{text: 'SJP Media Register', value: 'SJP_MEDIA_REGISTER'}];
  }

  public async validateFormFields(formValues: object, language: string): Promise<object> {
    const fields = {
      courtError: await this.validateCourt(formValues['input-autocomplete'], language),
      contentDateError: this.validateDate(this.buildDate(formValues,'content-date-from'), language),
      displayDateError: this.validateDates(this.buildDate(formValues, 'display-date-from'),
        this.buildDate(formValues, 'display-date-to'), language),
    };
    if (!fields.courtError && !fields.contentDateError && !fields.displayDateError) {
      return null;
    }
    return fields;
  }

  private async validateCourt(courtName: string, language: string): Promise<string> {
    if (courtName?.length >= 3) {
      const validCourt = await courtService.getLocationByName(courtName, language);
      if (validCourt) {
        return null;
      }

      if (language == 'cy') {
        return 'Nodwch a dewiswch lys dilys';
      } else {
        return 'Please enter and select a valid court';
      }
    }
    if (language == 'cy') {
      return 'Rhaid i enw llys fod yn dri nod neu fwy';
    } else {
      return 'Court name must be three characters or more';
    }
  }

  public buildDate(body: object, fieldsetPrefix: string): string {
    if(fieldsetPrefix === 'display-date-to') {
      return body[`${fieldsetPrefix}-day`]?.concat('/', body[`${fieldsetPrefix}-month`], '/', body[`${fieldsetPrefix}-year`], ' 23:59:59');
    } else if(fieldsetPrefix === 'display-date-from') {
      return body[`${fieldsetPrefix}-day`]?.concat('/', body[`${fieldsetPrefix}-month`],'/', body[`${fieldsetPrefix}-year`], ' 00:00:01');
    } else {
      return body[`${fieldsetPrefix}-day`]?.concat('/', body[`${fieldsetPrefix}-month`],'/', body[`${fieldsetPrefix}-year`], ' 00:00:00');
    }
  }

  private validateDates(dateFrom: string, dateTo: string, language: string): object {
    const dates = {
      from: this.validateDate(dateFrom, language),
      to: this.validateDate(dateTo, language),
      range: this.validateDateRange(dateFrom, dateTo, language),
    };
    if (!dates.from && !dates.to && !dates.range) {
      return null;
    }
    return dates;
  }

  private validateDate(date: string, language: string): string {
    const dateformat = moment(date, 'DD/MM/YYYY HH:mm:ss', true);
    if (dateformat.isValid()) {
      return null;
    }

    if (language == 'cy') {
      return 'Rhowch ddyddiad dilys';
    } else {
      return 'Please enter a valid date';
    }
  }

  private validateDateRange(dateFrom: string, dateTo: string, language: string): string | null {
    const firstDate = moment(dateFrom, 'DD/MM/YYYY HH:mm:ss', true);
    const secondDate = moment(dateTo, 'DD/MM/YYYY HH:mm:ss', true);
    if (firstDate.isSameOrBefore(secondDate)) {
      return null;
    }

    if (language == 'cy') {
      return 'Gwnewch yn siŵr bod y dyddiad \'hyd\' ar ôl y dyddiad \'o\'';
    } else {
      return 'Please make sure \'to\' date is after \'from\' date';
    }
  }

  public async appendlocationId(courtName: string, language: string): Promise<object> {
    const court = await courtService.getLocationByName(courtName, language);
    return {courtName: courtName, locationId: court?.locationId};
  }

  public async uploadPublication(data: any, ISODateFormat: boolean): Promise<boolean> {
    if (fileHandlingService.getFileExtension(data.fileName) === 'json') {
      return await dataManagementRequests.uploadJSONPublication(
        data,
        this.generatePublicationUploadHeaders(this.formatPublicationDates(data, ISODateFormat)),
      );
    } else {
      return await dataManagementRequests.uploadPublication(
        data,
        this.generatePublicationUploadHeaders(this.formatPublicationDates(data, ISODateFormat)),
      );
    }
  }

  public formatPublicationDates(formData: any, defaultFormat: boolean): object {
    return {
      ...formData,
      'display-from': defaultFormat ?
        moment(formData['display-from'], 'DD/MM/YYYY HH:mm:ss').format() :
        moment(formData['display-from'], 'DD/MM/YYYY').format('D MMM YYYY'),
      'display-to': defaultFormat ?
        moment(formData['display-to'], 'DD/MM/YYYY HH:mm:ss').format() :
        moment(formData['display-to'], 'DD/MM/YYYY').format('D MMM YYYY'),
      'content-date-from': defaultFormat ?
        moment(formData['content-date-from'], 'DD/MM/YYYY').format() :
        moment(formData['content-date-from'], 'DD/MM/YYYY').format('D MMM YYYY'),
    };
  }

  public generatePublicationUploadHeaders(headers): object {
    return {
      'x-provenance': 'MANUAL_UPLOAD',
      'x-source-artefact-id': headers.fileName,
      'x-type': headers.artefactType,
      'x-sensitivity': (headers.classification.includes('CLASSIFIED')) ? 'CLASSIFIED' : headers.classification,
      'x-language': headers.language,
      'x-display-from': headers['display-from'],
      'x-display-to': headers['display-to'],
      'x-list-type': headers.listType,
      'x-court-id': headers.court.locationId,
      'x-content-date': headers['content-date-from'],
      'x-issuer-email': headers.userEmail,
    };
  }
}
