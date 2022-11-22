import {partyRoleMappings} from '../models/consts';
import moment from 'moment-timezone';

export class DataManipulationService {

  public timeZone = 'Europe/London';

  /**
   * Manipulate the daily cause list json data for writing out on screen.
   * @param dailyCauseList
   */
  public manipulatedDailyListData(dailyCauseList: string): object {
    const dailyCauseListData = JSON.parse(dailyCauseList);
    let hearingCount = 0;
    dailyCauseListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['formattedJudiciaries'] = this.findAndManipulateJudiciary(session);
          session['sittings'].forEach(sitting => {
            this.calculateDuration(sitting);
            hearingCount = hearingCount + sitting['hearing'].length;
            this.findAndConcatenateHearingPlatform(sitting, session);

            sitting['hearing'].forEach(hearing => {
              this.findAndManipulatePartyInformation(hearing);
            });
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });

    return dailyCauseListData;
  }

  /**
   * Manipulate the sjpPressList json data for writing out on screen.
   * @param sjpPressListJson
   */
  public formatSJPPressList(sjpPressListJson: string): object {
    let hearingCount = 0;
    const sjpPressListData = JSON.parse(sjpPressListJson);
    sjpPressListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['sittings'].forEach(sitting => {
            sitting['hearing'].forEach(hearing => {
              hearingCount++;
              hearing['party'].forEach(party => {
                if (party['individualDetails']) {
                  party['individualDetails']['formattedDateOfBirth'] = moment(party['individualDetails']['dateOfBirth'].split('/').reverse().join('-')).format('D MMMM YYYY');
                }
              });

              hearing['offence'].forEach(offence => {
                const reportingRestriction = offence['reportingRestriction'].toString();
                offence['formattedReportingRestriction'] = reportingRestriction.charAt(0).toUpperCase() +
                  reportingRestriction.slice(1);
              });
            });
          });
        });
      });
    });

    sjpPressListData['hearingCount'] = hearingCount;

    return sjpPressListData;
  }

  /**
   * Manipulate the sscsDailyList json data for writing out on screen.
   * @param sscsDailyList
   */
  public manipulateSscsDailyListData(sscsDailyList: string): object {
    const sscsDailyListData = JSON.parse(sscsDailyList);
    let hearingCount = 0;

    sscsDailyListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['formattedJudiciary'] = this.getJudiciaryNameSurname(session);
          delete session['judiciary'];

          session['sittings'].forEach(sitting => {
            hearingCount = hearingCount + sitting['hearing'].length;
            sitting['sittingStartFormatted'] = this.publicationTimeInBst(sitting['sittingStart']);
            delete sitting['sittingStart'];
            this.findAndConcatenateHearingPlatform(sitting, session);
            delete sitting['channel'];
            delete session['sessionChannel'];
            sitting['hearing'].forEach(hearing => {
              this.findAndManipulatePartyInformation(hearing);

              hearing['informant'].forEach(informant => {
                let prosecutionAuthorityRefFormatted = '';
                informant['prosecutionAuthorityRef'].forEach(proscAuthRef => {
                  if (prosecutionAuthorityRefFormatted.length > 0) {
                    prosecutionAuthorityRefFormatted += ', ' + proscAuthRef;
                  } else {
                    prosecutionAuthorityRefFormatted += proscAuthRef;
                  }
                });
                hearing['prosecutionAuthorityRefFormatted'] = prosecutionAuthorityRefFormatted;
              });

              delete hearing['informant'];
              delete hearing['party'];
            });
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });
    return sscsDailyListData;
  }

  /**
   * Reshaping etDailyList json data into formatted niceness.
   */
  public reshapeEtDailyListData(etDailyList: string): object {
    const etDailyListData = JSON.parse(etDailyList);
    let hearingCount = 0;
    etDailyListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['formattedJudiciary'] = this.getJudiciaryNameSurname(session);
          delete session['judiciary'];
          session['sittings'].forEach(sitting => {
            hearingCount = hearingCount + sitting['hearing'].length;
            sitting['sittingStartFormatted'] = this.publicationTimeInBst(sitting['sittingStart']);
            this.calculateDuration(sitting);
            this.findAndConcatenateHearingPlatform(sitting, session);
            sitting['hearing'].forEach(hearing => {
              this.findAndManipulatePartyInformation(hearing, true);
            });
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });
    return etDailyListData;
  }

  /**
   * Reshaping etDailyList json data into formatted niceness. It first loops through to populate fields in a nice way,
   * then loops through again to split data into days. Not O(1) but I think the world is just gonna have to deal.
   */
  public reshapeEtFortnightlyListData(etFortList: string): object {
    const etFortnightlyListData = JSON.parse(etFortList);
    let hearingCount = 0;
    etFortnightlyListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['formattedJudiciary'] = this.getJudiciaryNameSurname(session);
          delete session['judiciary'];
          session['sittings'].forEach(sitting => {
            hearingCount = hearingCount + sitting['hearing'].length;
            sitting['sittingStartFormatted'] = this.publicationTimeInBst(sitting['sittingStart']);
            this.calculateDuration(sitting);
            this.findAndConcatenateHearingPlatform(sitting, session);
            sitting['hearing'].forEach(hearing => {
              this.findAndManipulatePartyInformation(hearing, true);
            });
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });
    return this.dataSplitterEtList(etFortnightlyListData);
  }

  /**
   * Method which runs through an et fortnightly list and splits it out into courtHouses and days.
   * @param inputList - input et daily list json.
   * @private - cos it's internal.
   */
  private dataSplitterEtList(inputList: any): any {
    const rows = [];
    inputList['courtLists'].forEach(courtList => {
      const courtName = courtList['courtHouse']['courtHouseName'];
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['sittings'].forEach(sitting => {
            const sittingDate = moment.utc(sitting['sittingStart']).tz(this.timeZone).format('dddd DD MMMM YYYY');
            sitting['hearing'].forEach(hearing => {
              hearing['case'].forEach(thisCase => {
                const row = {
                  courtName: courtName,
                  sittingDate: sittingDate,
                  sittingTime: this.publicationTimeInBst(sitting['sittingStart']),
                  addressLine: courtList['courtHouse']['courtHouseAddress']['line'],
                  addressTown: courtList['courtHouse']['courtHouseAddress']['town'],
                  addressCounty: courtList['courtHouse']['courtHouseAddress']['county'],
                  addressPostCode: courtList['courtHouse']['courtHouseAddress']['postCode'],
                  courtRoom: courtRoom['courtRoomName'],
                  durationAsHours: sitting['durationAsHours'],
                  durationAsMinutes: sitting['durationAsMinutes'],
                  caseNumber: thisCase['caseNumber'],
                  caseSeparator: thisCase['caseSequenceIndicator'],
                  claimant: hearing['appellant'],
                  claimantRep: hearing['appellantRepresentative'],
                  respondent: hearing['respondent'],
                  hearingType: hearing['hearingType'],
                  jurisdiction: thisCase['caseType'],
                  hearingPlatform: sitting['caseHearingChannel'],
                };
                console.log(row);
                rows.push(row);
              });
            });
          });
        });
      });
    });
    return this.splitByCourtAndDate(rows);
  }

  /**
   * Nasty wee function that builds a horrible data structure that gets parsed by the template.
   * @param data - the ingested et fortnightly list
   * @private cos it's for local
   */
  private splitByCourtAndDate(data: any) {
    const courts = [];
    const uniqueCourts = this.uniquesInArrayByAttrib(data, 'courtName');
    let courtCounter = 0;
    uniqueCourts.forEach(court => {
      const courtData = data.filter(row => row.courtName === court);
      courts.push({'courtName': court, days: []});
      const uniqueDays = this.uniquesInArrayByAttrib(courtData, 'sittingDate');
      const uniqueDaysArr = [];
      Array.from(uniqueDays).forEach(day => {
        const encDay = moment.utc(day, 'dddd DD MMMM YYYY').tz(this.timeZone);
        uniqueDaysArr.push(encDay);
      });
      uniqueDaysArr.sort(function(a, b) {
        return a - b;
      });
      uniqueDaysArr.forEach(day => {
        const formattedDay = moment.utc(day).tz(this.timeZone).format('dddd DD MMMM YYYY');
        const record = courtData.filter(row => row.sittingDate === formattedDay);
        courts[courtCounter]['days'].push(record);
      });
      courtCounter += 1;
    });
    return courts;
  }

  /**
   * returns all unique vals for given attribute in array of objs
   * @param data array of obs
   * @param thisAttribute attrib to be checked
   * @private
   */
  public uniquesInArrayByAttrib(data: any, thisAttribute: string) {
    return [...new Set(data.map(item => item[thisAttribute]))];
  }

  /**
   * Manipulate the copDailyCauseList json data for writing out on screen.
   * @param copDailyCauseList The cop daily cause list to manipulate
   */
  public manipulateCopDailyCauseList(copDailyCauseList: string): object {
    const copDailyCauseListData = JSON.parse(copDailyCauseList);
    let hearingCount = 0;

    copDailyCauseListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['formattedJudiciary'] = this.getJudiciaryNameSurname(session);
          delete session['judiciary'];
          session['sittings'].forEach(sitting => {
            hearingCount = hearingCount + sitting['hearing'].length;
            sitting['sittingStartFormatted'] = this.publicationTimeInBst(sitting['sittingStart']);
            this.calculateDuration(sitting);
            this.findAndConcatenateHearingPlatform(sitting, session);
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });
    return copDailyCauseListData;
  }

  /**
   * Manipulate the party information data for writing out on screen.
   * @param hearing
   * @param initialised
   */
  findAndManipulatePartyInformation(hearing: any, initialised = false): void {
    let applicant = '';
    let appellant = '';
    let respondent = '';
    let respondentRepresentative = '';
    let applicantRepresentative = '';
    let prosecutingAuthority = '';
    let defendant = '';
    let appellantRepresentative = '';
    if (hearing?.party) {
      hearing.party.forEach(party => {

        switch (DataManipulationService.convertPartyRole(party.partyRole)) {
          case 'APPLICANT_PETITIONER': {
            applicant += this.createIndividualDetails(party.individualDetails, initialised).trim();
            applicant += this.stringDelimiter(applicant?.length, ',');
            break;
          }
          case 'APPLICANT_PETITIONER_REPRESENTATIVE': {
            const applicantPetitionerDetails = this.createIndividualDetails(party.individualDetails, initialised).trim();
            if (applicantPetitionerDetails) {
              applicantRepresentative += 'LEGALADVISOR: ' + applicantPetitionerDetails + ', ';
            }
            break;
          }
          case 'CLAIMANT_PETITIONER': {
            appellant += this.createIndividualDetails(party.individualDetails, initialised).trim();
            appellant += this.stringDelimiter(appellant?.length, ',');
            break;
          }
          case 'CLAIMANT_PETITIONER_REPRESENTATIVE': {
            appellantRepresentative += this.createIndividualDetails(party.individualDetails, initialised).trim();
            appellantRepresentative += this.stringDelimiter(appellantRepresentative?.length, ',');
            break;
          }
          case 'RESPONDENT': {
            respondent += this.createIndividualDetails(party.individualDetails, initialised).trim();
            respondent += this.stringDelimiter(respondent?.length, ',');
            break;
          }
          case 'RESPONDENT_REPRESENTATIVE': {
            const respondentDetails = this.createIndividualDetails(party.individualDetails, initialised).trim();
            if (respondentDetails) {
              respondentRepresentative += 'LEGALADVISOR: ' + respondentDetails + ', ';

            }
            break;
          }
          case 'PROSECUTING_AUTHORITY':
          {
            prosecutingAuthority += this.createIndividualDetails(party.individualDetails, initialised).trim();
            prosecutingAuthority += this.stringDelimiter(prosecutingAuthority?.length, ',');
            break;
          }
          case 'DEFENDANT':
          {
            defendant += this.createIndividualDetails(party.individualDetails, initialised).trim();
            defendant += this.stringDelimiter(defendant?.length, ',');
            break;
          }
        }
      });
      hearing['appellant'] = appellant?.replace(/,\s*$/, '').trim();
      hearing['appellantRepresentative'] = appellantRepresentative?.replace(/,\s*$/, '').trim();

      applicant += applicantRepresentative;
      respondent += respondentRepresentative;
      hearing['applicant'] = applicant?.replace(/,\s*$/, '').trim();
      hearing['respondent'] = respondent?.replace(/,\s*$/, '').trim();
      hearing['prosecutingAuthority'] = prosecutingAuthority?.replace(/,\s*$/, '').trim();
      hearing['defendant'] = defendant?.replace(/,\s*$/, '').trim();
    }
  }

  /**
   * Format a set of individuals details. If the first letter of forename should be initialised, pass in true.
   * @param individualDetails
   * @param initialised
   */
  private createIndividualDetails(individualDetails: any, initialised = false): string {

    const title = this.writeStringIfValid(individualDetails?.title);
    const forenames = this.writeStringIfValid(individualDetails?.individualForenames);
    const forenameInitial = forenames.charAt(0);
    const middleName = this.writeStringIfValid(individualDetails?.individualMiddleName);
    const surname = this.writeStringIfValid(individualDetails?.individualSurname);
    if (initialised) {

      return title + (title.length > 0 ? ' ' : '')
        + forenameInitial + (forenameInitial.length > 0 ? '. ' : '')
        + surname;
    } else {
      return title + (title.length > 0 ? ' ' : '')
        + forenames + (forenames.length > 0 ? ' ' : '')
        + middleName + (middleName.length > 0 ? ' ' : '')
        + surname;
    }
  }

  /**
   * Helper function for strings.
   * @param stringToCheck
   */
  public writeStringIfValid(stringToCheck): string {
    if (stringToCheck) {
      return stringToCheck;
    } else {
      return '';
    }
  }

  /**
   * Helper function for strings.
   * @param stringSize
   * @param delimiter
   */
  public stringDelimiter(stringSize: number, delimiter: string): string {
    if (stringSize > 0) {
      return `${delimiter} `;
    }
    return '';
  }

  /**
   * Map the supplied party role to one of our party roles if necessary.
   * @param nonConvertedPartyRole
   */
  public static convertPartyRole(nonConvertedPartyRole: string): string {
    let partyRole = nonConvertedPartyRole;
    for (const [mappedPartyRole, unMappedRoles] of Object.entries(partyRoleMappings)) {
      if (unMappedRoles.includes(nonConvertedPartyRole)) {
        partyRole = mappedPartyRole;
      }
    }
    return partyRole;
  }

  /**
   * Manipulate hearing platform data for writing out to screen. Needed to be amended to include optional hearing
   * channel for PUB-1319.
   * @param sitting
   * @param session
   */
  findAndConcatenateHearingPlatform(sitting: object, session: object): void {
    let caseHearingChannel = '';
    if (sitting['channel'] || session['sessionChannel']) {
      if (sitting['channel']?.length > 0) {
        caseHearingChannel = sitting['channel'].join(', ');
      } else if (session['sessionChannel'].length > 0) {
        caseHearingChannel = session['sessionChannel'].join(', ');
      }
    }
    sitting['caseHearingChannel'] = caseHearingChannel;
  }

  /**
   * Manipulate judicary data for writing out to screen.
   * @param session
   */
  public findAndManipulateJudiciary(session: object): string {
    let judiciaries = '';
    let foundPresiding = false;
    session['judiciary']?.forEach(judiciary => {
      if (judiciary?.isPresiding === true) {
        judiciaries = this.writeStringIfValid(judiciary?.johKnownAs);
        foundPresiding = true;
      } else if (!foundPresiding) {
        if (this.writeStringIfValid(judiciary?.johKnownAs) !== '') {
          judiciaries += this.writeStringIfValid(judiciary?.johKnownAs) + ', ';
        }
      }
    });

    if (!foundPresiding) {
      judiciaries = judiciaries.slice(0, -2);
    }

    return judiciaries;
  }

  /**
   * Format linked cases by joining individual case ID with delimiter
   * @param hearing
   */
  public findAndManipulateLinkedCases(hearing: object): void {
    hearing['case'].forEach(hearingCase => {
      let linkedCases = '';
      let counter = 1;
      hearingCase['caseLinked']?.forEach(linkedCase => {
        linkedCases += (counter == hearingCase['caseLinked'].length)
          ? linkedCase['caseId']
          : linkedCase['caseId'] + ', ';
        counter++;
      });
      hearingCase['formattedLinkedCases'] = linkedCases;
    });
  }

  /**
   * Calculate the duration of a sitting.
   * @param sitting
   */
  public calculateDuration(sitting: object): void {
    sitting['duration'] = '';
    sitting['startTime'] = '';
    if (sitting['sittingStart'] !== '' && sitting['sittingEnd'] !== '') {
      const sittingStart = moment.utc(sitting['sittingStart']);
      const sittingEnd = moment.utc(sitting['sittingEnd']);

      let durationAsHours = 0;
      let durationAsMinutes = moment.duration(sittingEnd.startOf('minutes').diff(sittingStart.startOf('minutes'))).asMinutes();
      if (durationAsMinutes >= 60) {
        durationAsHours = Math.floor(durationAsMinutes / 60);
        durationAsMinutes = durationAsMinutes - (durationAsHours * 60);
      }

      let durationAsDays = 0;
      if(durationAsHours >= 24) {
        durationAsDays = Math.floor(durationAsHours / 24);
      }

      sitting['durationAsHours'] = durationAsHours;
      sitting['durationAsMinutes'] = durationAsMinutes;
      sitting['durationAsDays'] = durationAsDays;

      sitting['time'] = moment.utc(sitting['sittingStart']).tz(this.timeZone).format('HH:mm');
      const min = moment(sitting['sittingStart'], 'HH:mm').minutes();
      if (min === 0) {
        sitting['startTime'] = moment.utc(sitting['sittingStart']).tz(this.timeZone).format('ha');
      } else {
        sitting['startTime'] = moment.utc(sitting['sittingStart']).tz(this.timeZone).format('h.mma');
      }
    }
  }

  /**
   * Function which extracts the time from a UTC Date Time in BST format.
   * @param publicationDatetime The publication date time to convert in UTC.
   */
  public publicationTimeInBst(publicationDatetime: string): string {
    const min = moment.utc(publicationDatetime, 'HH:mm').tz(this.timeZone).minutes();
    let publishedTime = '';
    if (min === 0) {
      publishedTime = moment.utc(publicationDatetime).tz(this.timeZone).format('ha');
    } else {
      publishedTime = moment.utc(publicationDatetime).tz(this.timeZone).format('h:mma');
    }
    return publishedTime;
  }

  /**
   * Function which extracts the date from a UTC Date Time in BST format.
   * @param publicationDatetime The publication date time to convert in UTC.
   */
  public publicationDateInBst(publicationDatetime: string): string {
    return moment.utc(publicationDatetime).tz(this.timeZone).format('DD MMMM YYYY');
  }

  /**
   * Get the regional JoH from the supplied location details
   * Return either an empty string or a formatted JoH
   * @param locationDetails The object to get the regional JoH from
   */
  public getRegionalJohFromLocationDetails(locationDetails: object): string {
    let formattedJoh = '';
    locationDetails['region']['regionalJOH']?.forEach(joh => {
      if (formattedJoh.length > 0) {
        formattedJoh += ', ';
      }
      if (this.writeStringIfValid(joh?.johKnownAs) !== '') {
        formattedJoh += this.writeStringIfValid(joh?.johKnownAs);
      }

      if (this.writeStringIfValid(joh?.johNameSurname) !== '') {
        if (this.writeStringIfValid(joh?.johKnownAs) !== '') {
          formattedJoh += ' ';
        }
        formattedJoh += this.writeStringIfValid(joh?.johNameSurname);
      }
    });
    return formattedJoh;
  }

  /**
   * Take in the session and return the formatted judiciary with their title and nameSurname
   * @param session The session to get the judiciary from
   */
  public getJudiciaryNameSurname(session: object): string {
    let judiciaryFormatted = '';
    session['judiciary']?.forEach(judiciary => {
      if (judiciaryFormatted.length > 0) {
        judiciaryFormatted += ', ';
      }

      if (this.writeStringIfValid(judiciary?.johTitle) !== '') {
        judiciaryFormatted += this.writeStringIfValid(judiciary?.johTitle);
      }

      if (this.writeStringIfValid(judiciary?.johNameSurname) !== '') {
        if (this.writeStringIfValid(judiciary?.johTitle) !== '') {
          judiciaryFormatted += ' ';
        }
        judiciaryFormatted += this.writeStringIfValid(judiciary?.johNameSurname);
      }
    });
    return judiciaryFormatted;
  }

  public getDeduplicatedJudiciaryNameSurname(courtRoom: object): string {
    const judiciaries = [];
    courtRoom['session'].forEach(session => {
      session['judiciary']?.forEach(judiciary => {
        let currentJudiciary = '';
        if (this.writeStringIfValid(judiciary?.johTitle) !== '') {
          currentJudiciary = this.writeStringIfValid(judiciary?.johTitle);
        }

        if (this.writeStringIfValid(judiciary?.johNameSurname) !== '') {
          if (this.writeStringIfValid(judiciary?.johTitle) !== '') {
            currentJudiciary += ' ';
          }
          currentJudiciary += this.writeStringIfValid(judiciary?.johNameSurname);
        }

        if (!judiciaries.includes(currentJudiciary)) {
          judiciaries.push(currentJudiciary);
        }
      });
    });
    return judiciaries.join(', ');
  }
}
