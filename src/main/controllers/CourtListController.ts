import {Application} from "express";
import {CourtActions} from '../resources/actions/CourtActions';
import {InputFilterService} from "../service/inputFilterService";
import {randomBytes} from 'crypto'

export default class CourtListController {

  /**
   * Generates the Nonce header for the inline javascript, and returns the updated headers
   * @param currentCspHeader - The current headers
   * @param bytes The byte array representing the nonce
   * @private
   */
  private generateNonce(currentCspHeader, bytes) {

    let cspHeaders = currentCspHeader.split(';');
    let updatedHeaders = '';
    cspHeaders.forEach(item => {
      let itemToAdd = '';
      if (item.startsWith("script-src")) {
        itemToAdd = item + ' \'nonce-' + bytes + '\'';
      } else {
        itemToAdd = item;
      }

      if (updatedHeaders === '') {
        updatedHeaders = itemToAdd;
      } else {
        updatedHeaders = updatedHeaders + ';' + itemToAdd;
      }
    });

    return updatedHeaders;
  }

  /**
   * Generates the court array, that can then be processed by the template
   * The court array is of the format
   * {
   *   "A": {
   *     "CourtName": {
   *       "id": 1,
   *       "hearings": 4
   *     }
   *   }
   * }
   * The produced list is ordered in alphabetical order
   * @param courtsList The original court array
   * @private
   */
  private generateCourtArray(courtsList) {
    let alphabetArray = {};
    //Firstly creates the array for the possible alphabet options
    for (let i = 0; i < 26; i++) {
      let letter = String.fromCharCode(65 + i)
      alphabetArray[letter] = {};
    }

    courtsList = new InputFilterService().alphabetiseResults(courtsList, 'name')

    //Then loop through each court, and add it to the list
    courtsList.forEach(item => {
      if (item.hearings != 0) {
        let courtName = item.name as string;
        alphabetArray[courtName.charAt(0).toUpperCase()][courtName] = {
          id: item.courtId,
          hearings: item.hearings
        };
      }
    })
    return alphabetArray;
  }

  public get(req: Request, res: Application) {

    let courtsList = new CourtActions().getCourtsList();
    let alphabetArray = this.generateCourtArray(courtsList);

    const bytes = randomBytes(16).toString('base64')
    let updatedHeaders = this.generateNonce(res.get("Content-Security-Policy"), bytes)

    res.set("Content-Security-Policy", updatedHeaders);
    res.render("court-list", {
      courtList: alphabetArray,
      scriptNonce: bytes
    });
  }

}
