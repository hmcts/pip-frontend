import {PipApi} from "../../utils/PipApi";

export class HearingActions {
  constructor(private readonly api: PipApi) {}

  public async getCourtHearings(courtId: number) {
    const courtHearings = await this.api.getHearingList(courtId);
    return courtHearings;
  }
}
