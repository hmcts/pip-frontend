import { LocationService } from './locationService';
import { DataManagementRequests } from '../resources/requests/dataManagementRequests';
import {DateTime} from 'luxon';

import { FileHandlingService } from './fileHandlingService';
import { PublicationService } from './publicationService';

const courtService = new LocationService();
const dataManagementRequests = new DataManagementRequests();
import {LanguageFileParser} from '../helpers/languageFileParser';
const languageFileParser = new LanguageFileParser();
const fileHandlingService = new FileHandlingService();
const publicationService = new PublicationService();

const timeZone = 'Europe/London';

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
      listItem.dateRange = `${DateTime.fromISO(value.displayFrom, {zone: timeZone}).toFormat('d MMMM yyyy')} to ${DateTime.fromISO(value.displayTo, {zone: timeZone}).toFormat('d MMMM yyyy')}`;
      listItem.contDate = DateTime.fromISO(value.contentDate, {zone: timeZone}).toFormat('d MMMM yyyy');
      formattedList.push(listItem);
    });
    return formattedList;
  }

  private getListSubtypes(): Array<object> {
    const jsonArray = [] as Array<object>;
    publicationService.getListTypes().forEach((value, key) => {
      jsonArray.push({'value': key, 'text': value.shortenedFriendlyName });
    });

    return jsonArray;
  }

  public getListItemName(itemValue: string): string {
    return publicationService.getListTypes().get(itemValue).shortenedFriendlyName;
  }

  private getJudgementOutcomesSubtypes(): Array<object> {
    return [{text: 'SJP Media Register', value: 'SJP_MEDIA_REGISTER'}];
  }

  public async validateFormFields(formValues: object, language: string, languageFile: string): Promise<object> {
    const fields = {
      courtError: await this.validateCourt(formValues['input-autocomplete'], language, languageFile),
      contentDateError: this.validateDate(this.buildDate(formValues,'content-date-from'), language, languageFile),
      displayDateError: this.validateDates(this.buildDate(formValues, 'display-date-from'),
        this.buildDate(formValues, 'display-date-to'), language, languageFile),
    };
    if (!fields.courtError && !fields.contentDateError && !fields.displayDateError) {
      return null;
    }
    return fields;
  }

  private async validateCourt(courtName: string, language: string, languageFile: string): Promise<string> {
    const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
    if (courtName?.length >= 3) {
      const validCourt = await courtService.getLocationByName(courtName, language);
      if (validCourt) {
        return null;
      }

      return languageFileParser.getText(fileJson, 'courtSearchErrors', 'notFound');
    }

    return languageFileParser.getText(fileJson, 'courtSearchErrors', 'minCharactersReq');
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

  private validateDates(dateFrom: string, dateTo: string, language: string, languageFile: string): object {
    const dates = {
      from: this.validateDate(dateFrom, language, languageFile),
      to: this.validateDate(dateTo, language, languageFile),
      range: this.validateDateRange(dateFrom, dateTo, language, languageFile),
    };
    if (!dates.from && !dates.to && !dates.range) {
      return null;
    }
    return dates;
  }

  private validateDate(date: string, language: string, languageFile: string): string {
    const dateformat = DateTime.fromFormat(date, 'dd/MM/yyyy HH:mm:ss');
    if (dateformat.isValid) {
      return null;
    }
    const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
    return languageFileParser.getText(fileJson, 'dateErrors', 'blank');
  }

  private validateDateRange(dateFrom: string, dateTo: string, language: string, languageFile: string): string | null {
    const firstDate = DateTime.fromFormat(dateFrom, 'dd/MM/yyyy HH:mm:ss');
    const secondDate = DateTime.fromFormat(dateTo, 'dd/MM/yyyy HH:mm:ss');
    if (firstDate.startOf("day") <= secondDate.startOf("day")) {
      return null
    }

    const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
    return languageFileParser.getText(fileJson, 'dateErrors', 'dateRange');
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

  public async uploadLocationDataPublication(data: any): Promise<boolean> {
    return await dataManagementRequests.uploadLocationFile(data);
  }

  public formatPublicationDates(formData: any, defaultFormat: boolean): object {
    return {
      ...formData,
      'display-from': defaultFormat ?
        DateTime.fromFormat(formData['display-from'], 'dd/MM/yyyy HH:mm:ss').toISO() :
        DateTime.fromFormat(formData['display-from'], 'dd/MM/yyyy HH:mm:ss').toFormat('d MMMM yyyy'),
      'display-to': defaultFormat ?
        DateTime.fromFormat(formData['display-to'], 'dd/MM/yyyy HH:mm:ss').toISO() :
        DateTime.fromFormat(formData['display-to'], 'dd/MM/yyyy HH:mm:ss').toFormat('d MMMM yyyy'),
      'content-date-from': defaultFormat ?
        DateTime.fromFormat(formData['content-date-from'], 'dd/MM/yyyy HH:mm:ss').toISO() :
        DateTime.fromFormat(formData['content-date-from'], 'dd/MM/yyyy HH:mm:ss').toFormat('d MMMM yyyy'),
    };
  }

  public generatePublicationUploadHeaders(headers): object {
    return {
      'x-provenance': 'MANUAL_UPLOAD',
      'x-source-artefact-id': headers.fileName,
      'x-type': headers.artefactType,
      'x-sensitivity': headers.classification,
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
