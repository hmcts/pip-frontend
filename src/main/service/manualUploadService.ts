import { CourtService } from './courtService';
import { allowedFileTypes } from '../models/consts';
import { DataManagementRequests } from '../resources/requests/dataManagementRequests';
import moment from 'moment';
import fs from 'fs';

const courtService = new CourtService();
const dataManagementRequests = new DataManagementRequests();

export class ManualUploadService {

  public async buildFormData(): Promise<object> {
    const data = {
      courtList: await courtService.fetchAllCourts(),
      listSubtypes: this.getListSubtypes(),
      judgementsOutcomesSubtypes: this.getJudgementOutcomesSubtypes(),
      classification: this.getClassificationLevels(),
    };
    return data;
  }

  private getListSubtypes(): Array<object> {
    return [
      {text:'SJP Public List', value: 'SJP_PUBLIC_LIST'},
      {text: 'SJP Press List', value: 'SJP_PRESS_LIST'},
      {text: 'Civil Daily Cause List', value: 'CIVIL_DAILY_CAUSE_LIST'},
      {text: 'Family Daily Cause List', value: 'FAMILY_DAILY_CAUSE_LIST'},
    ];
  }

  private getJudgementOutcomesSubtypes(): Array<object> {
    return [{text: 'SJP Media Register', value: 'SJP_MEDIA_REGISTER'}];
  }

  private getClassificationLevels(): Array<object> {
    return [
      {text: 'Public', value: 'PUBLIC'},
      {text: 'Private', value: 'PRIVATE'},
      {text: 'Classified - verified CFT', value: 'CLASSIFIED_CFT'},
      {text: 'Classified - verified Crime', value: 'CLASSIFIED_CRIME'},
      {text: 'Classified - Media ', value: 'CLASSIFIED_MEDIA'},
    ];
  }

  public validateFileUpload(file: File): string {
    if (file) {
      if (this.isValidFileType(file['originalname'])) {
        if (this.isFileCorrectSize(file.size)) {
          return null;
        }
        return 'File too large, please upload file smaller than 2MB';
      }
      return 'Please upload a valid file format';
    }
    return 'Please provide a file';
  }

  private isValidFileType(fileName: string): boolean {
    const fileType = fileName.split('.')[1];
    return allowedFileTypes.includes(fileType);
  }

  private isFileCorrectSize(fileSize: number): boolean {
    return fileSize <= 2000000;
  }

  public async validateFormFields(formValues: object): Promise<object> {
    const fields = {
      courtError: await this.validateCourt(formValues['input-autocomplete']),
      contentDateError: this.validateDates(formValues['content-date-from'], formValues['content-date-to']),
      displayDateError: this.validateDates(formValues['display-from'], formValues['display-to']),
    };
    if (!fields.courtError && !fields.contentDateError && !fields.displayDateError) {
      return null;
    }
    return fields;
  }

  private async validateCourt(courtName: string): Promise<string> {
    if (courtName?.length > 3) {
      const validCourt = await courtService.getCourtByName(courtName);
      if (validCourt) {
        return null;
      }
      return 'Please enter and select a valid court';
    }
    return 'Court name must be three characters or more';
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

  private validateDateRange(dateFrom: string, dateTo: string) {
    const firstDate = moment(dateFrom, 'DD/MM/YYYY', true);
    const secondDate = moment(dateTo, 'DD/MM/YYYY', true);
    if (firstDate.isBefore(secondDate)) {
      return null;
    }
    return 'Please make sure \'to\' date is after \'from\' date';
  }

  public async appendCourtId(courtName: string): Promise<object> {
    const court = await courtService.getCourtByName(courtName);
    return {courtName: courtName, courtId: court?.courtId};
  }

  public async uploadPublication(data: any, ISODateFormat: boolean): Promise<boolean> {
    if (this.getFileExtension(data.fileName) === 'json') {
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

  public removeFile(file): void {
    const filePath = `./manualUpload/tmp/${file}`;
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Error while deleting ${file}.`);
    }
  }

  public readFile(fileName): object {
    try {
      if (this.getFileExtension(fileName) === 'json') {
        const rawData = fs.readFileSync(`./manualUpload/tmp/${fileName}`, 'utf-8');
        return JSON.parse(rawData);
      } else {
        return fs.readFileSync(`./manualUpload/tmp/${fileName}`);
      }
    } catch (err) {
      console.error(`Error while reading the file ${err}.`);
      return null;
    }
  }

  public formatPublicationDates(formData: any, defaultFormat: boolean): object {
    return {
      ...formData,
      'display-from': defaultFormat ? moment(formData['display-from'], 'DD/MM/YYYY').format() : moment().format('D MMM YYYY'),
      'display-to': defaultFormat ? moment(formData['display-to'], 'DD/MM/YYYY').format() : moment().format('D MMM YYYY'),
      'content-date-from': defaultFormat ? moment(formData['content-date-from'], 'DD/MM/YYYY').format() : moment().format('D MMM YYYY'),
      'content-date-to': defaultFormat ? moment(formData['content-date-to'], 'DD/MM/YYYY').format() : moment().format('D MMM YYYY'),
    };
  }

  public generatePublicationUploadHeaders(headers): object {
    return {
      'x-provenance': headers.userId,
      'x-source-artefact-id': headers.fileName,
      'x-type': headers.artefactType,
      'x-sensitivity': headers.classification,
      'x-language': headers.language,
      'x-display-from': headers['display-from'],
      'x-display-to': headers['display-to'],
      'x-list-type': headers.listType,
      'x-court-id': headers.court.courtId,
      'x-content-date': headers['content-date-from'],
    };
  }

  private getFileExtension(fileName: string): string {
    const regex = /(?:\.([^.]+))?$/;
    return regex.exec(fileName)[1];
  }
}
