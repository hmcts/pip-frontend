export class SjpPublicListService {
    /**
     * Format the SJP public list json data for writing out on screen.
     * @param formatSjpPublicList SJP list raw data
     */
    public formatSjpPublicList(sjpPublicListJson: string): any {
        const rows = [];
        JSON.parse(sjpPublicListJson).courtLists.forEach(courtList => {
            courtList.courtHouse.courtRoom.forEach(courtRoom => {
                courtRoom.session.forEach(session => {
                    session.sittings.forEach(sitting => {
                        sitting.hearing.forEach(hearing => {
                            this.buildCases(hearing, rows);
                        });
                    });
                });
            });
        });
        return rows;
    }

    private buildCases(hearing, rows): any {
        const partyDetails = this.buildPartyDetails(hearing.party);
        const offence = this.buildOffence(hearing.offence);

        if (partyDetails.name && partyDetails.postcode && partyDetails.prosecutorName && offence) {
            rows.push({
                ...partyDetails,
                offence: offence,
            });
        }
    }

    private buildPartyDetails(parties) {
        let name = '';
        let postcode = '';
        let organisationName = '';
        parties.forEach(party => {
            if (party.partyRole === 'ACCUSED') {
                name = [party.individualDetails.individualForenames, party.individualDetails.individualSurname].join(
                    ' '
                );
                postcode = party.individualDetails.address.postCode;
            } else if (party.partyRole === 'PROSECUTOR') {
                organisationName = party.organisationDetails.organisationName;
            }
        });

        return {
            name: name,
            postcode: postcode,
            prosecutorName: organisationName,
        };
    }

    private buildOffence(offences): any {
        let offenceTitle = '';
        offences.forEach(offence => {
            if (offenceTitle.length > 0) {
                offenceTitle = [offenceTitle, offence.offenceTitle].join(', ');
            } else {
                offenceTitle = offence.offenceTitle;
            }
        });
        return offenceTitle;
    }
}
