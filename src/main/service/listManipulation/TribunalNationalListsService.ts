import { ListParseHelperService } from '../listParseHelperService';
import { calculateDurationSortValue, formatDate, formatDuration } from '../../helpers/dateTimeHelper';

const helperService = new ListParseHelperService();

/**
 * Model class only used in this file, to hold case information.
 */
class CaseInformation {
    hearingDate: string;
    caseName: string;
    durationAsDays: number;
    durationAsHours: number;
    durationAsMinutes: number;
    caseSequenceIndicator: string;
    hearingType: string;
    venueAddress: string;

    constructor(
        hearingDate,
        caseName,
        durationAsHours,
        durationAsMinutes,
        caseSequenceIndicator,
        hearingType,
        venueAddress
    ) {
        this.hearingDate = hearingDate;
        this.caseName = caseName;
        this.durationAsDays = durationAsHours >= 24 ? Math.floor(durationAsHours / 24) : 0;
        this.durationAsHours = durationAsHours;
        this.durationAsMinutes = durationAsMinutes;
        this.caseSequenceIndicator = caseSequenceIndicator;
        this.hearingType = hearingType;
        this.venueAddress = venueAddress;
    }
}

/**
 * Service to manipulate the primary health list nunjucks template.
 */
export class TribunalNationalListsService {
    /**
     * Method to manipulate the data and return an object of the formatted data.
     */
    public manipulateData(stringList: string, language: string, languageFile: string): object {
        const listData = JSON.parse(stringList);
        const allData = [];

        listData['courtLists'].forEach(courtList => {
            const venueAddress = this.formatVenueAddress(
                courtList['courtHouse']['courtHouseName'],
                courtList['courtHouse']['courtHouseAddress']
            );

            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    const hearingDate = formatDate(session['sessionStartTime'], 'dd MMMM', language);
                    session['sittings'].forEach(sitting => {
                        helperService.calculateDuration(sitting);
                        const durationAsHours = sitting['durationAsHours'];
                        const durationAsMinutes = sitting['durationAsMinutes'];

                        sitting['hearing'].forEach(hearing => {
                            const hearingType = hearing['hearingType'];

                            hearing['case'].forEach(courtCase => {
                                const caseName = courtCase.caseName;
                                const caseSequenceIndicator = courtCase.caseSequenceIndicator;

                                allData.push(
                                    this.formatCase(
                                        new CaseInformation(
                                            hearingDate,
                                            caseName,
                                            durationAsHours,
                                            durationAsMinutes,
                                            caseSequenceIndicator,
                                            hearingType,
                                            venueAddress
                                        ),
                                        language,
                                        languageFile
                                    )
                                );
                            });
                        });
                    });
                });
            });
        });
        return allData;
    }

    /**
     * Format the data into an object, then pass back for further processing.
     */
    private formatCase(caseInformation, language, languageFile) {
        return {
            hearingDate: caseInformation.hearingDate,
            caseName: caseInformation.caseName,
            durationAsDays: caseInformation.durationAsDays,
            durationAsHours: caseInformation.durationAsHours,
            durationAsMinutes: caseInformation.durationAsMinutes,
            formattedDuration: formatDuration(
                caseInformation.durationAsDays as number,
                caseInformation.durationAsHours as number,
                caseInformation.durationAsMinutes as number,
                language,
                languageFile
            ),
            durationSortValue: calculateDurationSortValue(
                caseInformation.durationAsDays as number,
                caseInformation.durationAsHours as number,
                caseInformation.durationAsMinutes as number
            ),
            caseSequenceIndicator: caseInformation.caseSequenceIndicator,
            hearingType: caseInformation.hearingType,
            venue: caseInformation.venueAddress,
        };
    }

    /**
     * Format and concatenate the venue name and address only if the venue name is not empty or null.
     */
    private formatVenueAddress(courtHouseName: string, courtHouseAddress: object): string {
        const address = [];
        address.push(courtHouseName);

        if (courtHouseAddress) {
            if (courtHouseAddress['line']) {
                courtHouseAddress['line'].forEach(line => address.push(line));
            }
            address.push(courtHouseAddress['town'] ? courtHouseAddress['town'] : '');
            address.push(courtHouseAddress['county'] ? courtHouseAddress['county'] : '');
            address.push(courtHouseAddress['postCode'] ? courtHouseAddress['postCode'] : '');
        }
        return address.filter(line => line.trim().length > 0).join('\n');
    }
}
