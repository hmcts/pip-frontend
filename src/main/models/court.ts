export interface Court {
  courtId: number;
  name: string;
  jurisdiction: string;
  location: string;
  hearingList: Array<any>;
  hearings: number;
}
