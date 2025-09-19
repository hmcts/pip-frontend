import { ListParseHelperService } from '../ListParseHelperService';
import { formatDate } from '../../helpers/dateTimeHelper';

const helperService = new ListParseHelperService();

export class CrownPddaListService {
    public processPayload(payload: JSON, language: string, listType: string): any[] {
        const results = [];
        const isDailyList = listType.includes('daily');
        const payloadPath = isDailyList ? 'DailyList' : 'FirmList';
        payload[payloadPath].CourtLists.forEach(courtList => {
            const courtHouse = courtList.CourtHouse;
            results.push({
                sittingDate: isDailyList
                    ? ''
                    : formatDate(this.toIsoDate(courtList.SittingDate), 'EEEE dd MMMM yyyy', language),
                courtName: courtHouse.CourtHouseName,
                courtAddress: courtHouse.CourtHouseAddress ? this.formatAddress(courtHouse.CourtHouseAddress) : [],
                courtPhone: courtHouse.CourtHouseTelephone ? courtHouse.CourtHouseTelephone : '',
                sittings: this.buildSittingInfo(courtList, isDailyList),
            });
        });
        return results;
    }

    private buildSittingInfo(courtList: any, isDailyList: boolean): any[] {
        const sittings = [];
        courtList.Sittings.forEach(sitting => {
            sittings.push({
                courtRoomNumber: sitting.CourtRoomNumber,
                sittingAt: sitting.SittingAt ? helperService.publicationTimeInUkTime(sitting.SittingAt) : '',
                judgeName: this.formatJudgeName(sitting.Judiciary),
                hearings: this.buildHearings(sitting, isDailyList),
            });
        });
        return sittings;
    }

    private buildHearings(sitting: any, isDailyList: boolean): any[] {
        const hearings = [];
        sitting.Hearings.forEach(hearing => {
            let representativeName;
            if (isDailyList) {
                representativeName = '';
            } else {
                representativeName = hearing.Defendants ? this.formatRepresentativeName(hearing.Defendants) : '';
            }

            hearings.push({
                caseNumber: hearing.CaseNumberCaTH,
                defendantName: hearing.Defendants ? this.formatDefendantName(hearing.Defendants) : '',
                hearingType: hearing.HearingDetails.HearingDescription,
                representativeName,
                prosecutingAuthority: hearing.Prosecution?.ProsecutingAuthority
                    ? hearing.Prosecution.ProsecutingAuthority
                    : '',
                listNote: hearing.ListNote ? hearing.ListNote : '',
            });
        });
        return hearings;
    }

    private formatJudgeName(judiciary): string {
        const names = [];
        names.push(this.formatIndividualName(judiciary.Judge));

        if (judiciary.Justice) {
            judiciary.Justice.forEach(justice => {
                names.push(this.formatIndividualName(justice));
            });
        }
        return names.filter(name => name.trim().length > 0).join(', ');
    }

    formatDefendantName(defendants): string {
        const names = [];
        defendants.forEach(defendant => {
            names.push(this.useMaskedNameIfRequested(defendant.PersonalDetails));
        });
        return names.filter(name => name.trim().length > 0).join(', ');
    }

    private formatRepresentativeName(defendants): string {
        const names = [];
        defendants.forEach(defendant => {
            defendant.Counsel?.forEach(counsel =>
                counsel.Solicitor?.forEach(solicitor => {
                    const party = solicitor.Party;
                    if (party?.Person) {
                        names.push(this.useMaskedNameIfRequested(party.Person.PersonalDetails));
                    } else if (party?.Organisation) {
                        names.push(party.Organisation.OrganisationName);
                    }
                })
            );
        });
        return names.filter(name => name.trim().length > 0).join(', ');
    }

    private useMaskedNameIfRequested(nameDetails): string {
        if (nameDetails.IsMasked && nameDetails.IsMasked == 'YES') {
            return nameDetails.MaskedName ? nameDetails.MaskedName : '';
        }
        return this.formatIndividualName(nameDetails.Name);
    }

    private formatIndividualName(individual): string {
        return individual.CitizenNameRequestedName
            ? individual.CitizenNameRequestedName
            : this.formatNameParts(individual);
    }

    private formatNameParts(individual): string {
        const nameParts = [];
        if (individual.CitizenNameTitle) {
            nameParts.push(individual.CitizenNameTitle);
        }
        if (individual.CitizenNameForename) {
            nameParts.push(individual.CitizenNameForename);
        }
        if (individual.CitizenNameSurname) {
            nameParts.push(individual.CitizenNameSurname);
        }
        if (individual.CitizenNameSuffix) {
            nameParts.push(individual.CitizenNameSuffix);
        }
        return nameParts.filter(part => part.trim().length > 0).join(' ');
    }

    public formatAddress(address): string[] {
        const addressLines = [];
        if (address) {
            address.Line.forEach(line => addressLines.push(line));
            if (address.Postcode) {
                addressLines.push(address.Postcode);
            }
        }
        return addressLines.filter(line => line.trim().length > 0);
    }

    public toIsoDate(date: string): string {
        const dateParts = date.split('-');
        return new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2])).toISOString();
    }
}
