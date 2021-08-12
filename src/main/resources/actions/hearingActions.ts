import fs from 'fs';
import path from 'path';

export class HearingActions {
  mocksPath = '../mocks/';

  getCourtHearings(courtId: number): any {
    const rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'hearingsList.json'), 'utf-8');
    const hearingsData = JSON.parse(rawData);
    const courtHearings = hearingsData?.results.filter((hearing) => hearing.courtId === courtId);
    return courtHearings;
  }

  getHearingDetails(hearingId: number): any {
    const rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'hearingsList.json'), 'utf-8');
    const hearingsData = JSON.parse(rawData);
    const hearingDetails = hearingsData?.results.find((hearing) => hearing.hearingId === hearingId);
    return hearingDetails ? hearingDetails : null;
  }
}
