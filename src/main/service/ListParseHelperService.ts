import { partyRoleMappings } from '../helpers/consts';
import { DateTime } from 'luxon';

const timeZone = 'Europe/London';
const utc = 'utc';
const dateFormat = 'dd MMMM yyyy';
const timeFormatHourOnly = 'ha';
const timeFormatHourMinute = 'h:mma';
const minutesPerHour = 60;
const hoursPerDay = 24;

export class ListParseHelperService {
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
        let defendantRep = '';
        let appellantRepresentative = '';

        if (hearing?.party) {
            hearing.party.forEach(party => {
                switch (ListParseHelperService.convertPartyRole(party.partyRole)) {
                    case 'APPLICANT_PETITIONER': {
                        applicant += this.handleParties(party, initialised).trim();
                        applicant += this.stringDelimiter(applicant.length, ',');
                        break;
                    }
                    case 'APPLICANT_PETITIONER_REPRESENTATIVE': {
                        applicantRepresentative += this.handleParties(party, initialised).trim();
                        applicantRepresentative += this.stringDelimiter(applicantRepresentative.length, ',');
                        break;
                    }
                    case 'CLAIMANT_PETITIONER': {
                        appellant += this.handleParties(party, initialised).trim();
                        appellant += this.stringDelimiter(appellant.length, ',');
                        break;
                    }
                    case 'CLAIMANT_PETITIONER_REPRESENTATIVE': {
                        appellantRepresentative += this.handleParties(party, initialised).trim();
                        appellantRepresentative += this.stringDelimiter(appellantRepresentative.length, ',');
                        break;
                    }
                    case 'RESPONDENT': {
                        respondent += this.handleParties(party, initialised).trim();
                        respondent += this.stringDelimiter(respondent.length, ',');
                        break;
                    }
                    case 'RESPONDENT_REPRESENTATIVE': {
                        respondentRepresentative += this.handleParties(party, initialised).trim();
                        respondentRepresentative += this.stringDelimiter(respondentRepresentative.length, ',');
                        break;
                    }
                    case 'PROSECUTING_AUTHORITY': {
                        prosecutingAuthority += this.handleParties(party, initialised).trim();
                        prosecutingAuthority += this.stringDelimiter(prosecutingAuthority.length, ',');
                        break;
                    }
                    case 'DEFENDANT': {
                        defendant += this.handleParties(party, initialised).trim();
                        defendant += this.stringDelimiter(defendant.length, ',');
                        break;
                    }
                    case 'DEFENDANT_REPRESENTATIVE': {
                        defendantRep += this.handleParties(party, initialised).trim();
                        defendantRep += this.stringDelimiter(defendant.length, ',');
                    }
                }
            });

            hearing['appellant'] = appellant.replace(/,\s*$/, '').trim();
            hearing['appellantRepresentative'] = appellantRepresentative.replace(/,\s*$/, '').trim();
            hearing['applicant'] = applicant.replace(/,\s*$/, '').trim();
            hearing['applicantRepresentative'] = applicantRepresentative?.replace(/,\s*$/, '').trim();
            hearing['respondent'] = respondent.replace(/,\s*$/, '').trim();
            hearing['respondentRepresentative'] = respondentRepresentative.replace(/,\s*$/, '').trim();
            hearing['prosecutingAuthority'] = prosecutingAuthority.replace(/,\s*$/, '').trim();
            hearing['defendant'] = defendant.replace(/,\s*$/, '').trim();
            hearing['defendantRepresentative'] = defendantRep.replace(/,\s*$/, '').trim();
        }
    }

    private handleParties(party: any, initialised = false) {
        if (party.individualDetails) {
            return this.createIndividualDetails(party.individualDetails, initialised);
        } else if (party.organisationDetails) {
            return this.createOrganisationDetails(party.organisationDetails);
        }

        return '';
    }

    /**
     * Format a set of individuals details. If the first letter of forename should be initialised, pass in true.
     * @param individualDetails
     * @param initialised
     */
    public createIndividualDetails(individualDetails: any, initialised = false): string {
        const title = ListParseHelperService.writeStringIfValid(individualDetails?.title);
        const forenames = ListParseHelperService.writeStringIfValid(individualDetails?.individualForenames);
        const forenameInitial = forenames.charAt(0);
        const middleName = ListParseHelperService.writeStringIfValid(individualDetails?.individualMiddleName);
        const surname = ListParseHelperService.writeStringIfValid(individualDetails?.individualSurname);
        if (initialised) {
            return (
                title +
                (title.length > 0 ? ' ' : '') +
                forenameInitial +
                (forenameInitial.length > 0 ? '. ' : '') +
                surname
            );
        } else {
            return [title, forenames, middleName, surname].filter(n => n.length > 0).join(' ');
        }
    }

    /**
     * Format a set of organisation details.
     * @param organisationDetails
     */
    public createOrganisationDetails(organisationDetails) {
        return ListParseHelperService.writeStringIfValid(organisationDetails?.organisationName);
    }

    /**
     * Helper function for strings.
     * @param stringToCheck
     */
    public static writeStringIfValid(stringToCheck): string {
        if (stringToCheck) {
            return stringToCheck;
        }
        return '';
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
            } else if (session['sessionChannel']?.length > 0) {
                caseHearingChannel = session['sessionChannel'].join(', ');
            }
        }
        sitting['caseHearingChannel'] = caseHearingChannel;
    }

    /**
     * Manipulate judiciary data for writing out to screen.
     * @param session
     */
    public findAndManipulateJudiciary(session: object): string {
        const judiciaries = [];
        session['judiciary']?.forEach(judiciary => {
            const name = ListParseHelperService.writeStringIfValid(judiciary.johKnownAs);
            if (name.trim() !== '') {
                judiciary.isPresiding === true ? judiciaries.unshift(name) : judiciaries.push(name);
            }
        });
        return judiciaries.join(', ');
    }

    /**
     * Manipulate crime list judiciary data for writing out to screen.
     * @param session
     */
    public findAndManipulateJudiciaryForCrime(session: object): string {
        const judiciaries = [];
        session['judiciary']?.forEach(judiciary => {
            const title = ListParseHelperService.writeStringIfValid(judiciary.johTitle);
            const name = ListParseHelperService.writeStringIfValid(judiciary.johNameSurname);
            const judge = [title, name].filter(j => j.length > 0).join(' ');
            if (judge.trim() !== '') {
                judiciary.isPresiding === true ? judiciaries.unshift(judge) : judiciaries.push(judge);
            }
        });
        return judiciaries.join(', ');
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
                linkedCases +=
                    counter == hearingCase['caseLinked'].length ? linkedCase['caseId'] : linkedCase['caseId'] + ', ';
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
        if (sitting['sittingStart'] !== '' && sitting['sittingEnd'] !== '') {
            const sittingStart = DateTime.fromISO(sitting['sittingStart'], {
                zone: utc,
            });
            const sittingEnd = DateTime.fromISO(sitting['sittingEnd'], {
                zone: utc,
            });
            let durationAsHours = 0;
            let durationAsMinutes = Math.round(sittingEnd.diff(sittingStart, 'minutes').minutes);

            if (durationAsMinutes >= minutesPerHour) {
                durationAsHours = Math.floor(durationAsMinutes / minutesPerHour);
                durationAsMinutes = durationAsMinutes - durationAsHours * minutesPerHour;
            }

            let durationAsDays = 0;
            if (durationAsHours >= hoursPerDay) {
                durationAsDays = Math.floor(durationAsHours / hoursPerDay);
            }

            sitting['durationAsHours'] = durationAsHours;
            sitting['durationAsMinutes'] = durationAsMinutes;
            sitting['durationAsDays'] = durationAsDays;

            if (sittingStart.minute === 0) {
                this.formatCaseTime(sitting, timeFormatHourOnly);
            } else {
                this.formatCaseTime(sitting, timeFormatHourMinute);
            }
        }
    }

    public formatCaseTime(sitting: object, format: string): void {
        if (sitting['sittingStart'] !== '') {
            const sittingStart = sitting['sittingStart'];
            let zonedDateTime = DateTime.fromISO(sittingStart, {
                zone: timeZone,
            });
            //If json time is zoned time, we do not need to add the offset into the time. Luxon will do automatically.
            //But, if time does not contain zoned time. Luxon always return offset (+01:00) with the time,
            //so we need to add the offset manually
            if (sittingStart.substr(sittingStart.length - 1) !== 'Z') {
                zonedDateTime = zonedDateTime.plus({ minutes: zonedDateTime.offset });
            }
            sitting['time'] = zonedDateTime.toFormat(format).toLowerCase();
        }
    }

    /**
     * Function which extracts the time from a UTC Date Time in BST format.
     * @param publicationDatetime The publication date time to convert in UTC.
     */
    public publicationTimeInUkTime(publicationDatetime: string): string {
        const publicationZonedDateTime = DateTime.fromISO(publicationDatetime, {
            zone: timeZone,
        });
        let publishedTime = '';
        if (publicationZonedDateTime.minute === 0) {
            publishedTime = publicationZonedDateTime.toFormat(timeFormatHourOnly).toLowerCase();
        } else {
            publishedTime = publicationZonedDateTime.toFormat(timeFormatHourMinute).toLowerCase();
        }
        return publishedTime;
    }

    /**
     * Function which extracts the date from a UTC Date Time in BST format.
     * @param publicationDatetime The publication date time to convert in UTC.
     */
    public publicationDateInUkTime(publicationDatetime: string, language: string): string {
        return DateTime.fromISO(publicationDatetime, { zone: timeZone }).setLocale(language).toFormat(dateFormat);
    }

    public contentDateInUtcTime(contentDatetime: string, language: string): string {
        return DateTime.fromISO(contentDatetime, { zone: utc }).setLocale(language).toFormat(dateFormat);
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
            if (ListParseHelperService.writeStringIfValid(joh?.johKnownAs) !== '') {
                formattedJoh += ListParseHelperService.writeStringIfValid(joh?.johKnownAs);
            }
        });
        return formattedJoh;
    }

    public static formatReportingRestrictionDetail(jsonNode): string {
        return jsonNode.reportingRestrictionDetail?.filter(n => n.length > 0).join(', ')
    }
}
