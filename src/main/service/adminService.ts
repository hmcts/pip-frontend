import { DataManagementRequests } from '../resources/requests/dataManagementRequests';
import moment from 'moment';

const dataManagementRequests = new DataManagementRequests();

export class AdminService {
  public async uploadPublication(data: any): Promise<boolean> {
    return await dataManagementRequests.uploadPublication(data.file, this.generatePublicationUploadHeaders(data.body));
  }

  public formatPublicationDates(fileUploadData: any, defaultFormat: boolean): object {
    return {
      ...fileUploadData,
      'display-from': defaultFormat ? moment(fileUploadData['display-from']).format() : moment().format('D MMM YYYY'),
      'display-to': defaultFormat ? moment(fileUploadData['display-to']).format() : moment().format('D MMM YYYY'),
      'content-date-from': defaultFormat ? moment(fileUploadData['content-date-from']).format() : moment().format('D MMM YYYY'),
      'content-date-to': defaultFormat ? moment(fileUploadData['content-date-to']).format() : moment().format('D MMM YYYY'),
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
      'x-court-id': headers.courtId,
      'x-content-date': headers['content-date-from'],
    };
  }
}
