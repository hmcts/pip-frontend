import { AxiosInstance } from 'axios';


export class PipApi {

  constructor(
    private readonly axios: AxiosInstance
  ) { }


  public getCourtDetails(courtId: number): Promise<any> {
    return this.axios
      .get(`/court/${courtId}`, {  headers: {'Accept-Language': "en"}})
      .then(results => results.data)
      .catch(err => {
        return {};
      });
  }

  public getCourtList(inputSearch: String): Promise<any> {
    return this.axios
      .get(`/courtlist/${inputSearch}`, {  headers: {'Accept-Language': "en"}})
      .then(results => results.data)
      .catch(err => {
        return {};
      });
  }

  public getAllCourtList(): Promise<any> {
    console.log(this.axios)
    return this.axios
      .get(`/courtlistall/`, {  headers: {'Accept-Language': "en"}})
      .then(results => results.data)
      .catch(err => {

        return {};
      });
    console.log('Hello World')
  }


  public getHearingList(courtId: number): Promise<any> {
    return this.axios
      .get(`/hearings/${courtId}`, {  headers: {'Accept-Language': "en"}})
      .then(results => results.data)
      .catch(err => {
        return {};
      });
  }

}
