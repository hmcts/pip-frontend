import { LocationService } from './locationService';
import { DataManagementRequests } from '../resources/requests/dataManagementRequests';
import { DateTime } from 'luxon';

import { FileHandlingService } from './fileHandlingService';
import { PublicationService } from './publicationService';

const courtService = new LocationService();
const dataManagementRequests = new DataManagementRequests();
import { LanguageFileParser } from '../helpers/languageFileParser';

const languageFileParser = new LanguageFileParser();
const fileHandlingService = new FileHandlingService();
const publicationService = new PublicationService();

const timeZone = 'Europe/London';

export class ManualUploadService {
    public async buildFormData(language: string): Promise<object> {
        return {
            courtList: await courtService.fetchAllLocations(language),
            listSubtypes: this.getListSubtypes(),
            judgementsOutcomesSubtypes: this.getJudgementOutcomesSubtypes(),
        };
    }

    public formatListRemovalValues(summaryList): any[] {
        const formattedList = [];
        summaryList.forEach(value => {
            const listItem = { ...value };
            listItem.listTypeName = this.getListItemName(value.listType);
            listItem.dateRange = `${DateTime.fromISO(value.displayFrom, {
                zone: timeZone,
            }).toFormat('d MMM yyyy')} to ${DateTime.fromISO(value.displayTo, {
                zone: timeZone,
            }).toFormat('d MMM yyyy')}`;
            listItem.contDate = DateTime.fromISO(value.contentDate, {
                zone: timeZone,
            }).toFormat('d MMM yyyy');
            formattedList.push(listItem);
        });
        return formattedList;
    }

    private getListSubtypes(): Array<object> {
        const jsonArray = [] as Array<object>;
        publicationService.getListTypes().forEach((value, key) => {
            jsonArray.push({ value: key, text: value.shortenedFriendlyName });
        });
        jsonArray.push({ value: 'EMPTY', text: '<Please choose a list type>' });
        jsonArray.sort((a, b) => (a['text'].toUpperCase() > b['text'].toUpperCase() ? 1 : -1));

        return jsonArray;
    }

    public getListItemName(itemValue: string): string {
        return publicationService.getListTypes().get(itemValue).shortenedFriendlyName;
    }

    /**
     * This method checks if the sensitivity provided is a mismatch with the default sensitivity.
     *
     * Not all list types have a default sensitivity. If one is not provided, then true is always returned.
     *
     * @param listType The list type to check.
     * @param sensitivity The sensitivity the user has provided.
     * @returns boolean indicated whether the list type is a mismatch with the default sensitivity.
     */
    public isSensitivityMismatch(listType: string, sensitivity: string): boolean {
        const defaultSensitivity = publicationService.getDefaultSensitivity(listType);
        if (defaultSensitivity) {
            return sensitivity !== defaultSensitivity;
        }

        return false;
    }

    public getSensitivityMappings() {
        const listTypes = publicationService.getListTypes();

        const listTypeMapping = {};

        listTypes.forEach((value, key) => {
            listTypeMapping[key] = value['defaultSensitivity'];
        });

        return listTypeMapping;
    }

    private getJudgementOutcomesSubtypes(): Array<object> {
        return [{ text: 'SJP Media Register', value: 'SJP_MEDIA_REGISTER' }];
    }

    public async validateFormFields(formValues: object, language: string, languageFile: string): Promise<object> {
        const fields = {
            courtError: await this.validateCourt(formValues['input-autocomplete'], language, languageFile),
            contentDateError: this.validateDate(
                this.buildDate(formValues, 'content-date-from'),
                language,
                languageFile
            ),
            displayDateError: this.validateDates(
                this.buildDate(formValues, 'display-date-from'),
                this.buildDate(formValues, 'display-date-to'),
                language,
                languageFile
            ),
            classificationError: formValues['classification'] ? null : 'true',
            listTypeError: formValues['listType'] != 'EMPTY' ? null : 'true',
        };
        if (
            fields.courtError ||
            fields.contentDateError ||
            fields.displayDateError ||
            fields.classificationError ||
            fields.listTypeError
        ) {
            return fields;
        }
        return null;
    }

    private async validateCourt(courtName: string, language: string, languageFile: string): Promise<string> {
        const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
        if (courtName?.length >= 3) {
            const validCourt = await courtService.getLocationByName(courtName, language);
            if (validCourt) {
                return null;
            }

            return languageFileParser.getText(fileJson, 'courtSearchErrors', 'notFound');
        }

        return languageFileParser.getText(fileJson, 'courtSearchErrors', 'minCharactersReq');
    }

    public buildDate(body: object, fieldsetPrefix: string): string {
        if (fieldsetPrefix === 'display-date-to') {
            return body[`${fieldsetPrefix}-day`]?.concat(
                '/',
                body[`${fieldsetPrefix}-month`],
                '/',
                body[`${fieldsetPrefix}-year`],
                ' 23:59:59'
            );
        } else if (fieldsetPrefix === 'display-date-from') {
            return body[`${fieldsetPrefix}-day`]?.concat(
                '/',
                body[`${fieldsetPrefix}-month`],
                '/',
                body[`${fieldsetPrefix}-year`],
                ' 00:00:01'
            );
        } else {
            return body[`${fieldsetPrefix}-day`]?.concat(
                '/',
                body[`${fieldsetPrefix}-month`],
                '/',
                body[`${fieldsetPrefix}-year`],
                ' 00:00:00'
            );
        }
    }

    private validateDates(dateFrom: string, dateTo: string, language: string, languageFile: string): object {
        const dates = {
            from: this.validateDate(dateFrom, language, languageFile),
            to: this.validateDate(dateTo, language, languageFile),
            range: this.validateDateRange(dateFrom, dateTo, language, languageFile),
        };
        if (!dates.from && !dates.to && !dates.range) {
            return null;
        }
        return dates;
    }

    private validateDate(date: string, language: string, languageFile: string): string {
        if (date != null) {
            const dateformat = DateTime.fromFormat(date, 'dd/MM/yyyy HH:mm:ss');
            if (dateformat.isValid) {
                return null;
            }
        }
        const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
        return languageFileParser.getText(fileJson, 'dateErrors', 'blank');
    }

    private validateDateRange(dateFrom: string, dateTo: string, language: string, languageFile: string): string | null {
        if (dateFrom != null && dateTo != null) {
            const firstDate = DateTime.fromFormat(dateFrom, 'dd/MM/yyyy HH:mm:ss');
            const secondDate = DateTime.fromFormat(dateTo, 'dd/MM/yyyy HH:mm:ss');
            if (firstDate.startOf('day') <= secondDate.startOf('day')) {
                return null;
            }
        }

        const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
        return languageFileParser.getText(fileJson, 'dateErrors', 'dateRange');
    }

    public async appendlocationId(courtName: string, language: string): Promise<object> {
        const court = await courtService.getLocationByName(courtName, language);
        return { courtName: courtName, locationId: court?.locationId };
    }

    public async uploadPublication(data: any, ISODateFormat: boolean): Promise<string> {
        if (fileHandlingService.getFileExtension(data.fileName) === 'json') {
            return await dataManagementRequests.uploadJSONPublication(
                data,
                this.generatePublicationUploadHeaders(this.formatPublicationDates(data, ISODateFormat))
            );
        } else {
            return await dataManagementRequests.uploadPublication(
                data,
                this.generatePublicationUploadHeaders(this.formatPublicationDates(data, ISODateFormat))
            );
        }
    }

    public async uploadLocationDataPublication(data: any): Promise<boolean> {
        return await dataManagementRequests.uploadLocationFile(data);
    }

    public formatPublicationDates(formData: any, defaultFormat: boolean): object {
        return {
            ...formData,
            'display-from': this.checkAndFormatDates(formData['display-from'], defaultFormat),
            'display-to': this.checkAndFormatDates(formData['display-to'], defaultFormat),
            'content-date-from': this.checkAndFormatDates(formData['content-date-from'], defaultFormat),
        };
    }

    private checkAndFormatDates(date: any, defaultFormat: boolean): string {
        if (date != null) {
            return defaultFormat
                ? DateTime.fromFormat(date, 'dd/MM/yyyy HH:mm:ss').toISO()
                : DateTime.fromFormat(date, 'dd/MM/yyyy HH:mm:ss').toFormat('d MMMM yyyy');
        }
        return '';
    }

    public generatePublicationUploadHeaders(headers): object {
        return {
            'x-provenance': 'MANUAL_UPLOAD',
            'x-source-artefact-id': headers.fileName,
            'x-type': headers.artefactType,
            'x-sensitivity': headers.classification,
            'x-language': headers.language,
            'x-display-from': headers['display-from'],
            'x-display-to': headers['display-to'],
            'x-list-type': headers.listType,
            'x-court-id': headers.court.locationId,
            'x-content-date': headers['content-date-from'],
            'x-issuer-email': headers.userEmail,
        };
    }
}
