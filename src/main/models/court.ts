import {Protocol} from 'puppeteer';
import integer = Protocol.integer;

export interface Court {

  courtId: integer;

  name: string;

  jurisdiction: string;

  location: string;

  hearingList: Array<any>;

}
