import {PipApi} from '../../utils/PipApi';
import {Court} from '../../models/court';

export class CourtActions {


  constructor(private readonly api: PipApi) {}

  public async getCourtDetails(courtId: number): Promise<Court> {

    const court = await this.api.getCourtDetails(courtId);

    if (court) {
      return court;
    } else {
      console.log(`Court with id ${courtId} does not exist`);
      return null;
    }
  }

  public async getCourtList(inputSearch): Promise<Array<Court>> {


    const courts = await this.api.getCourtList(inputSearch);

    if (courts) {
      return courts;
    } else {
      console.log(`Court with id ${inputSearch} does not exist`);
      return null;
    }
  }

  public async getCourtsList(): Promise<Array<Court>> {

    const courts = await this.api.getAllCourtList();

    if (courts) {
      return courts;
    } else {
      return null;
    }
  }

}
