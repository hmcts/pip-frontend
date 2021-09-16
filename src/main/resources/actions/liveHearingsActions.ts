import fs from 'fs';
import path from 'path';

export class LiveHearingsActions {
  mocksPath = '../mocks/';
  rawData = fs.readFileSync(path.resolve(__dirname, this.mocksPath, 'liveHearings.json'), 'utf-8');

  getLiveCases(courtId: number): any {
    const liveCases = JSON.parse(this.rawData);
    const filteredLiveCases = liveCases?.results.filter((liveCase) => liveCase.courtId === courtId);
    if (filteredLiveCases.length) {
      return filteredLiveCases[0];
    } else {
      console.log(`Court with id ${courtId} does not exist`);
      return null;
    }
  }
}
