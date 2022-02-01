import { DataManagementRequests } from '../resources/requests/dataManagementRequests';
import moment from 'moment';
import fs from 'fs';

const dataManagementRequests = new DataManagementRequests();

export class AdminService {
  public async uploadPublication(data: any, ISODateFormat: boolean): Promise<boolean> {
    return await dataManagementRequests.uploadPublication(
      data.file,
      this.generatePublicationUploadHeaders(this.formatPublicationDates(data, ISODateFormat)),
    );
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
      return fs.readFileSync(`./manualUpload/tmp/${fileName}`);
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
      'x-source-artefact-id': headers.originalname,
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
}
