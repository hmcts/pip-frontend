import fs from 'fs';
import path from 'path';

export class CourtActions {
  mocksPath = '../mocks/';

  getCourtDetails(courtId: number): any {
    const rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'courtsAndHearingsCount.json'), 'utf-8');
    const courtsData = JSON.parse(rawData);
    const court = courtsData?.results.filter((court) => court.courtId === courtId);
    if (court.length) {
      console.log(court[0]);
      return court[0];
    } else {
      console.log(`Court with id ${courtId} does not exist`);
      return null;
    }
  }

  getCourtsList(): any {
    const rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'courtsAndHearingsCount.json'), 'utf-8');
    const courtsData = JSON.parse(rawData);
    if (courtsData?.results) {
      console.log(courtsData.results);
      return courtsData.results;
    } else {
      console.error('unable to get courts list');
      return [];
    }
  }
}
