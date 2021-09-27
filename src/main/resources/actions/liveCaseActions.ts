import fs from 'fs';
import path from 'path';

export class LiveCasesActions {
  mocksPath = '../mocks/';
  rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'liveCaseStatusUpdates.json'), 'utf-8');

  getLiveCases(courtId: number): any {
    const liveCases = JSON.parse(this.rawData);
    const filteredLiveCases = liveCases?.results.filter((liveCase) => liveCase.courtId === courtId);
    return (filteredLiveCases.length) ? filteredLiveCases[0] : null;
  }
}
