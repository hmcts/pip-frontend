import { CourtService } from './courtService';
import { DataManagementRequests } from '../resources/requests/dataManagementRequests';
import moment from 'moment';
import { FileHandlingService } from './fileHandlingService';

const courtService = new CourtService();
const dataManagementRequests = new DataManagementRequests();
const listSubTypes = [
  {text:'SJP Public List', value: 'SJP_PUBLIC_LIST'},
  {text: 'SJP Press List', value: 'SJP_PRESS_LIST'},
  {text: 'Civil Daily Cause List', value: 'CIVIL_DAILY_CAUSE_LIST'},
  {text: 'Family Daily Cause List', value: 'FAMILY_DAILY_CAUSE_LIST'},
  {text: 'Crown Daily List', value: 'CROWN_DAILY_LIST'},
  {text: 'Crown Firm List', value: 'CROWN_FIRM_LIST'},
  {text: 'Crown Warned List', value: 'CROWN_WARNED_LIST'},
  {text: 'Magistrates Public List', value: 'MAGS_PUBLIC_LIST'},
  {text: 'Magistrates Standard List', value: 'MAGS_STANDARD_LIST'},
];

const fileHandlingService = new FileHandlingService();

export class ManualUploadService {
  public async buildFormData(): Promise<object> {
    return {
      courtList: await courtService.fetchAllCourts(),
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

  public async validateFormFields(formValues: object): Promise<object> {
    const fields = {
      courtError: await this.validateCourt(formValues['input-autocomplete']),
      contentDateError: this.validateDate(this.buildDate(formValues,'content-date-from')),
      displayDateError: this.validateDates(this.buildDate(formValues, 'display-date-from'), this.buildDate(formValues, 'display-date-to')),
    };
    if (!fields.courtError && !fields.contentDateError && !fields.displayDateError) {
      return null;
    }
    return fields;
  }

  private async validateCourt(courtName: string): Promise<string> {
    if (courtName?.length >= 3) {
      const validCourt = await courtService.getCourtByName(courtName);
      if (validCourt) {
        return null;
      }
      return 'Please enter and select a valid court';
    }
    return 'Court name must be three characters or more';
  }

  public buildDate(body: object, fieldsetPrefix: string): string {
    return body[`${fieldsetPrefix}-day`]?.concat('/', body[`${fieldsetPrefix}-month`],'/', body[`${fieldsetPrefix}-year`]);
  }

  private validateDates(dateFrom: string, dateTo: string): object {
    const dates = {
      from: this.validateDate(dateFrom),
      to: this.validateDate(dateTo),
      range: this.validateDateRange(dateFrom, dateTo),
    };
    if (!dates.from && !dates.to && !dates.range) {
      return null;
    }
    return dates;
  }

  private validateDate(date: string): string {
    const dateformat = moment(date, 'DD/MM/YYYY', true);
    if (dateformat.isValid()) {
      return null;
    }
    return 'Please enter a valid date';
  }

  private validateDateRange(dateFrom: string, dateTo: string): string | null {
    const firstDate = moment(dateFrom, 'DD/MM/YYYY', true);
    const secondDate = moment(dateTo, 'DD/MM/YYYY', true);
    if (firstDate.isSameOrBefore(secondDate)) {
      return null;
    }
    return 'Please make sure \'to\' date is after \'from\' date';
  }

  public async appendCourtId(courtName: string): Promise<object> {
    const court = await courtService.getCourtByName(courtName);
    return {courtName: courtName, courtId: court?.courtId};
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
        moment(formData['display-from'], 'DD/MM/YYYY').format() :
        moment(formData['display-from'], 'DD/MM/YYYY').format('D MMM YYYY'),
      'display-to': defaultFormat ?
        moment(formData['display-to'], 'DD/MM/YYYY').format() :
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
      'x-court-id': headers.court.courtId,
      'x-content-date': headers['content-date-from'],
    };
  }
}
