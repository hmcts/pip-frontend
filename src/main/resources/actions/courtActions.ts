import fs from 'fs';
import path from 'path';

export class CourtActions {
  mocksPath = '../mocks/';
  rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'courtsAndHearingsCount.json'), 'utf-8');

  getCourtDetails(courtId: number): any {
    const courtsData = JSON.parse(this.rawData);
    const court = courtsData?.results.filter((court) => court.courtId === courtId);
    if (court.length) {
      return court[0];
    } else {
      console.log(`Court with id ${courtId} does not exist`);
      return null;
    }
  }

  getCourtsList(): any {
    const courtsData = JSON.parse(this.rawData);
    if (courtsData?.results) {
      return courtsData.results;
    } else {
      console.error('unable to get courts list');
      return [];
    }
  }

  courtNameIncluded(courtName: string): boolean {
    const courtsData = JSON.parse(this.rawData);
    return courtsData?.results.some((court) => court.name.includes(courtName));
  }
}
