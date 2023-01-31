import { DateTime } from 'luxon';
export class SjpPressListService {
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
                                    party['individualDetails']['formattedDateOfBirth'] = DateTime.fromISO(
                                        party['individualDetails']['dateOfBirth'].split('/').reverse().join('-')
                                    ).toFormat('d MMMM yyyy');
                                }
                            });

                            hearing['offence'].forEach(offence => {
                                const reportingRestriction = offence['reportingRestriction'].toString();
                                offence['formattedReportingRestriction'] =
                                    reportingRestriction.charAt(0).toUpperCase() + reportingRestriction.slice(1);
                            });
                        });
                    });
                });
            });
        });

        sjpPressListData['hearingCount'] = hearingCount;

        return sjpPressListData;
    }
}
