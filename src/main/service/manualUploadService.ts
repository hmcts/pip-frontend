import {CourtService} from './courtService';
import {allowedFileTypes} from '../models/consts';
import moment from 'moment';

const courtService = new CourtService();

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
}
