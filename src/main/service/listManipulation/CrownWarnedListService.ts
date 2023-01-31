import { ListParseHelperService } from '../listParseHelperService';
import { DateTime } from 'luxon';
import { formatDate } from '../../helpers/dateTimeHelper';
import { CrimeListsService } from './CrimeListsService';

const helperService = new ListParseHelperService();
const crimeListsService = new CrimeListsService();

export class CrownWarnedListService {
    public manipulateData(warnedListData: string, language: string): Map<string, object[]> {
        const listData = new Map<string, object[]>();
        JSON.parse(warnedListData).courtLists.forEach(courtList => {
            courtList.courtHouse.courtRoom.forEach(courtRoom => {
                courtRoom.session.forEach(session => {
                    session.sittings.forEach(sitting => {
                        sitting.sittingStartFormatted = formatDate(sitting.sittingStart, 'dd/MM/yyyy', language);
                        sitting.hearing.forEach(hearing => {
                            crimeListsService.manipulateParty(hearing);
                            helperService.findAndManipulateLinkedCases(hearing);
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

    public formatContentDate(contentDate: string, language: string) {
        const date = new Date(contentDate);
        // Move the date to the past Monday if it is not on a Monday
        date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
        return DateTime.fromISO(date.toISOString(), { zone: 'utc' }).setLocale(language).toFormat('dd MMMM yyyy');
    }
}
