import { DataManipulationService } from '../dataManipulationService';
import moment from 'moment';

const dataManipulationService = new DataManipulationService();
const separator = ', ';

export class CrownWarnedListService {
  public manipulateData(warnedListData: string): Map<string, object[]> {
    const listData = new Map<string, object[]>();
    JSON.parse(warnedListData).courtLists.forEach(courtList => {
      courtList.courtHouse.courtRoom.forEach(courtRoom => {
        courtRoom.session.forEach(session => {
          session.sittings.forEach(sitting => {
            sitting.sittingStartFormatted = moment.utc(sitting.sittingStart).format('DD/MM/YYYY');
            sitting.hearing.forEach(hearing => {
              this.manipulateParty(hearing);
              dataManipulationService.findAndManipulateLinkedCases(hearing);
              const rows = [];

              hearing.case.forEach(hearingCase => {
                const row = {
                  caseReference: hearingCase.caseNumber,
                  defendant: hearing.defendant,
                  hearingDate: sitting.sittingStartFormatted,
                  defendantRepresentative: hearing.defendantRepresentative,
                  prosecutingAuthority: hearing.prosecutingAuthority,
                  linkedCases: hearingCase.formattedLinkedCases,
                  listingNotes: hearing.listNote,
                };
                rows.push(row);
              });

              const key = hearing.hearingType;
              if (listData.has(key)) {
                listData.set(key, listData.get(key).concat(rows));
              } else {
                listData.set(key, rows);
              }
            });
          });
        });
      });
    });

    return listData;
  }

  public formatContentDate(contentDate: string) {
    const date = new Date(contentDate);
    // Move the date to the past Monday if it is not on a Monday
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return moment.utc(Date.parse(date.toUTCString())).format('DD MMMM YYYY');
  }

  private manipulateParty(hearing: any) {
    const defendants = [];
    const defendantRepresentatives = [];
    const prosecutingAuthorities = [];

    if (hearing?.party) {
      hearing.party.forEach(party => {
        switch (party.partyRole) {
          case 'DEFENDANT': {
            const defendant = this.createIndividualDetails(party.individualDetails);
            if (defendant.length > 0) {
              defendants.push(defendant);
            }
            break;
          }
          case 'DEFENDANT_REPRESENTATIVE': {
            const defendantRepresentative = this.createOrganisationDetails(party.organisationDetails);
            if (defendantRepresentative.length > 0) {
              defendantRepresentatives.push(defendantRepresentative);
            }
            break;
          }
          case 'PROSECUTING_AUTHORITY': {
            const prosecutingAuthority = this.createOrganisationDetails(party.organisationDetails);
            if (prosecutingAuthority.length > 0) {
              prosecutingAuthorities.push(prosecutingAuthority);
            }
            break;
          }
        }
      });
      hearing.defendant = defendants.join(separator);
      hearing.defendantRepresentative = defendantRepresentatives.join(separator);
      hearing.prosecutingAuthority = prosecutingAuthorities.join(separator);
    }
  }

  private createIndividualDetails(individualDetails: any): string {
    const forenames = individualDetails?.individualForenames ? individualDetails.individualForenames : '';
    const surname = individualDetails?.individualSurname ? individualDetails.individualSurname : '';
    return surname + (surname.length > 0 && forenames.length > 0 ? ', ' : '') + forenames;
  }

  private createOrganisationDetails(organisationDetails: any) {
    return organisationDetails?.organisationName ? organisationDetails.organisationName : '';
  }
}
