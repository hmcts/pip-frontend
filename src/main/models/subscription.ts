export interface Subscription {

  id: string;
  userId: string;
  searchType: string;
  searchValue: string;
  channel: string;
  createdDate: any;
  caseSubscriptions: any[];
  courtSubscriptions: any[];

}
