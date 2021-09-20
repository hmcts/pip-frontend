import fs from 'fs';
import path from 'path';

export class SearchDescriptionActions {
  mocksPath = '../mocks/';
  rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'StatusDescription.json'), 'utf-8');

  getStatusDescriptionList(): any {
    const statusDescriptionData = JSON.parse(this.rawData);
    if (statusDescriptionData?.results) {
      return statusDescriptionData.results;
    } else {
      console.error('unable to get court status description list');
      return [];
    }
  }
}
