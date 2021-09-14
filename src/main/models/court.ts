import {Protocol} from 'puppeteer';
import integer = Protocol.integer;

export class Court {

  courtId: integer;

  name: string;

  jurisdiction: string;

  location: string;

  hearingList: Array<any>;

}
