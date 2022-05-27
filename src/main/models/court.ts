export interface Court {
  locationId: number;
  name: string;
  jurisdiction: string;
  location: string;
  hearingList: Array<any>;
  hearings: number;
}
