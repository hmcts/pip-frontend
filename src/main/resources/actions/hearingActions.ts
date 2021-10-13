import { PipApi } from '../../utils/PipApi';

export class HearingActions {
  constructor(private readonly api: PipApi) {}

  public async getCourtHearings(courtId: number): Promise<any>{
    return await this.api.getHearingList(courtId);
  }

  public async findCourtHearings(searchQuery: string): Promise<any> {
    return await this.api.filterHearings(searchQuery);
  }
}
