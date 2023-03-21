import { DateTime } from 'luxon';
import { calculateDurationSortValue, formatDuration } from '../../helpers/dateTimeHelper';
import { CrimeListsService } from './CrimeListsService';
import { ListParseHelperService } from '../listParseHelperService';

const helperService = new ListParseHelperService();
const crimeListsService = new CrimeListsService();

export class CrownFirmListService {
    public timeZone = 'Europe/London';

    /**
     * Builds list of courthouses, does general formatting to make it appear nice, then is passed to second function which
     * deals with the splitting it by various dimensions (i.e. courthouse -> day -> courtRoom -> allocated/unallocated.
     * @param firmList
     * @param language
     * @param languageFile
     */
    public splitOutFirmListData(firmList: string, language: string, languageFile: string) {
        const rows = [];
        const firmListData = JSON.parse(firmList);
        firmListData['courtLists'].forEach(courtList => {
            const courtName = courtList['courtHouse']['courtHouseName'];
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    session['sittings'].forEach(sitting => {
                        const judiciary = helperService.findAndManipulateJudiciary(sitting);
                        if (judiciary !== '') {
                            session['formattedJudiciaries'] = judiciary;
                        }
                        const sittingDate = DateTime.fromISO(sitting['sittingStart'], {
                            zone: this.timeZone,
                        }).toFormat('EEEE dd MMMM yyyy');
                        sitting['formattedDuration'] = formatDuration(
                            sitting['durationAsDays'] as number,
                            sitting['durationAsHours'] as number,
                            sitting['durationAsMinutes'] as number,
                            language,
                            languageFile
                        );
                        sitting['durationSortValue'] = calculateDurationSortValue(
                            sitting['durationAsDays'] as number,
                            sitting['durationAsHours'] as number,
                            sitting['durationAsMinutes'] as number
                        );
                        sitting['hearing'].forEach(hearing => {
                            crimeListsService.findLinkedCasesInformation(hearing);
                            crimeListsService.manipulateParty(hearing);
                            hearing['case'].forEach(thisCase => {
                                const row = {
                                    courtName: courtName,
                                    sittingDate: sittingDate,
                                    sittingTime: helperService.publicationTimeInUkTime(sitting['sittingStart']),
                                    courtRoom: courtRoom['courtRoomName'],
                                    joh: session['formattedJudiciaries'],
                                    durationAsHours: sitting['durationAsHours'],
                                    durationAsMinutes: sitting['durationAsMinutes'],
                                    formattedDuration: sitting['formattedDuration'],
                                    durationSortValue: sitting['durationSortValue'],
                                    caseNumber: thisCase['caseNumber'],
                                    caseSeparator: thisCase['caseSequenceIndicator'],
                                    linkedCases: thisCase['linkedCases'],
                                    hearingNotes: hearing['listingNotes'],
                                    defendant: hearing['defendant'],
                                    defendantRepresentative: hearing['defendantRepresentative'],
                                    prosecutingAuthority: hearing['prosecutingAuthority'],
                                    hearingType: hearing['hearingType'],
                                    hearingPlatform: sitting['caseHearingChannel'],
                                };
                                rows.push(row);
                            });
                        });
                    });
                });
            });
        });
        return this.splitByCourtAndDateAndAllocation(rows);
    }

    /**
     * Gets the maximum list date from a given firm list
     */
    public getSittingDates(s: any) {
        const dates = [];
        s.forEach(court => {
            court.days.forEach(setOfDays => {
                dates.push(setOfDays[0].data[0].sittingDate);
            });
        });
        const newDates = dates.map(e => {
            return DateTime.fromFormat(e, 'EEEE dd MMMM yyyy', { zone: 'utc' });
        });
        return newDates.sort((a, b) => a.diff(b));
    }

    /**
     * Splits the formatted list from above into three different dimensions:
     * 1) First the cases are split by courtHouse
     * 2) Then, the data within each courthouse is split by day
     * 3) Then the data for each day/courtHouse pair is split by courtRoom.
     * After the splitting, the method ensures that all unallocated cases always fall at the end of the cases in the
     * current courtHouse/day/courtRoom using some array shuffling magic.
     * @param data
     * @private
     */
    private splitByCourtAndDateAndAllocation(data: any) {
        const courts = [];
        const uniqueCourts = helperService.uniquesInArrayByAttrib(data, 'courtName');
        let courtCounter = 0;

        uniqueCourts.forEach(court => {
            const courtData = data.filter(row => row.courtName === court);
            courts.push({ courtName: court, days: [] });
            const uniqueDays = helperService.uniquesInArrayByAttrib(courtData, 'sittingDate');
            const uniqueDaysArr = [];
            Array.from(uniqueDays).forEach(day => {
                const encDay = DateTime.fromFormat(day, 'EEEE dd MMMM yyyy', {
                    zone: 'utc',
                });
                uniqueDaysArr.push(encDay);
            });
            uniqueDaysArr.sort(function (a, b) {
                return a - b;
            });
            uniqueDaysArr.forEach(day => {
                const thisDayCourts = [];
                const formattedDay = DateTime.fromISO(day, { zone: 'utc' }).toFormat('EEEE dd MMMM yyyy');
                const record = courtData.filter(row => row.sittingDate === formattedDay);
                const uniqueCourtRooms = helperService.uniquesInArrayByAttrib(record, 'courtRoom');
                Array.from(uniqueCourtRooms).forEach(courtRoom => {
                    const room = record.filter(row => row.courtRoom === courtRoom);
                    thisDayCourts.push({ courtRoom: courtRoom, data: room });
                });
                // custom sort def - basically if it's got the string, move to end. Needed to be suppressed because eslint
                // does not understand that a compare function needs two vars.
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                function compare(a, b) {
                    if (a.courtRoom.toLowerCase().includes('to be allocated')) {
                        return 1;
                    } else if (b.courtRoom.toLowerCase().includes('to be allocated')) {
                        return -1;
                    } else {
                        return 0;
                    }
                }

                // custom sort usage below
                thisDayCourts.sort(compare);
                courts[courtCounter]['days'].push(thisDayCourts);
            });
            courtCounter += 1;
        });
        return courts;
    }
}
