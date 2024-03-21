import { ListParseHelperService } from '../listParseHelperService';
import { formatDate } from '../../helpers/dateTimeHelper';

const helperService = new ListParseHelperService();

export class IacDailyListService {
    public manipulateIacDailyListData(iacDailyList: string, language: string): object {
        const iacDailyListData = JSON.parse(iacDailyList);

        iacDailyListData['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    session['formattedJudiciary'] = helperService.findAndManipulateJudiciaryForCrime(session);
                    session['sittings'].forEach(sitting => {
                        sitting['sittingStartFormatted'] = formatDate(sitting['sittingStart'], 'h:mma', language);
                        helperService.findAndConcatenateHearingPlatform(sitting, session);
                        sitting['hearing'].forEach(hearing => {
                            helperService.findAndManipulatePartyInformation(hearing);
                        });
                    });
                });
            });
        });
        return iacDailyListData;
    }
}
