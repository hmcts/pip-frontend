import { AxiosInstance } from 'axios';


export class PipApi {
  constructor(private readonly axios: AxiosInstance) { }

  public getCourtDetails(courtId: number): Promise<any> {
    return this.axios
      .get('/api/court/' + courtId, {  headers: {'Accept-Language': 'en'}})
      .then(results => results.data)
      .catch(err => {
        return {err};
      });
  }

  public getCourtList(inputSearch: string): Promise<any> {
    return this.axios
      .get('/api/courtlist/' + inputSearch, {  headers: {'Accept-Language': 'en'}})
      .then(results => results.data)
      .catch(err => {
        return {err};
      });
  }

  public getAllCourtList(): Promise<any> {
    return this.axios
      .get('/api/courtlistall/', {  headers: {'Accept-Language': 'en'}})
      .then(results => results.data)
      .catch(err => {
        return {err};
      });
  }

  public getHearingList(courtId: number): Promise<any> {
    return this.axios
      .get('/api/hearings/' + courtId, {  headers: {'Accept-Language': 'en'}})
      .then(results => results.data)
      .catch(err => {
        return {err};
      });
  }

  public getStatusDescriptionList(): Promise<any> {
    return this.axios
      .get('/api/statusdescriptionlistall/', {  headers: {'Accept-Language': 'en'}})
      .then(results => results.data)
      .catch(err => {
        return {err};
      });
  }

}
