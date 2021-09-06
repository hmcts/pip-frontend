import {PipApi} from "../../utils/PipApi";

export class CourtActions {


  constructor(private readonly api: PipApi) {}

  public async getCourtDetails(courtId: number) {

    const court = await this.api.getCourtDetails(courtId);

    if (court) {
      return court;
    } else {
      console.log(`Court with id ${courtId} does not exist`);
      return null;
    }
  }

  public async getCourtList(inputSearch) {


    const courts = await this.api.getCourtList(inputSearch);

    if (courts) {
      return courts;
    } else {
      console.log(`Court with id ${inputSearch} does not exist`);
      return null;
    }
  }

  public async getCourtsList() {


    const courts = await this.api.getAllCourtList();

    if (courts) {
      return courts;
    } else {
      return null;
    }
  }

}
