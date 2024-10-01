import { DateTime } from 'luxon';
import { SubscriptionRequests } from '../resources/requests/SubscriptionRequests';
import { PendingSubscriptionsFromCache } from './PendingSubscriptionsFromCache';
import { UserSubscriptions } from '../models/UserSubscriptions';
import { PublicationService } from './PublicationService';
import { LocationService } from './LocationService';
import { FilterService } from './FilterService';
import { Location } from '../models/Location';
import { ListType } from '../models/ListType';
import { AToZHelper } from '../helpers/aToZHelper';
import { caseSubscriptionSorter, locationSubscriptionSorter } from '../helpers/sortHelper';

const subscriptionRequests = new SubscriptionRequests();
const pendingSubscriptionsFromCache = new PendingSubscriptionsFromCache();
const publicationService = new PublicationService();
const filterService = new FilterService();
const locationService = new LocationService();

const timeZone = 'Europe/London';
const dateFormat = 'dd MMMM yyyy';

export class SubscriptionService {
    public async getSubscriptionDataForView(userId: string, language: string, tab: string): Promise<object> {
        const subscriptionData = await this.getSubscriptionsByUser(userId);
        const caseTableData = await this.generateCaseTableRows(subscriptionData.caseSubscriptions, language);
        const locationTableData = await this.generateLocationTableRows(
            subscriptionData.locationSubscriptions,
            language
        );
        let activeAllTab = false,
            activeCaseTab = false,
            activeLocationTab = false;
        switch (tab) {
            case 'all':
                activeAllTab = true;
                break;
            case 'case':
                activeCaseTab = true;
                break;
            case 'location':
                activeLocationTab = true;
                break;
            default:
                activeAllTab = true;
                break;
        }

        return {
            caseTableData,
            locationTableData,
            activeAllTab,
            activeCaseTab,
            activeLocationTab,
        };
    }

    public async getSelectedSubscriptionDataForView(
        userId: string,
        language: string,
        subscriptionsToDelete: string[]
    ): Promise<object> {
        const subscriptionData = await this.getSubscriptionsByUser(userId);

        const caseSubscriptions = subscriptionData.caseSubscriptions.filter(subscription =>
            subscriptionsToDelete.includes(subscription.subscriptionId)
        );
        const caseTableData = await this.generateCaseTableRows(caseSubscriptions, language);

        const locationSubscriptions = subscriptionData.locationSubscriptions.filter(subscription =>
            subscriptionsToDelete.includes(subscription.subscriptionId)
        );
        const locationTableData = await this.generateLocationTableRows(locationSubscriptions, language);

        return {
            caseTableData,
            locationTableData,
        };
    }

    async getSubscriptionsByUser(userid: string): Promise<UserSubscriptions> {
        const subscriptionData = await subscriptionRequests.getUserSubscriptions(userid);
        return (
            subscriptionData || {
                caseSubscriptions: [],
                listTypeSubscriptions: [],
                locationSubscriptions: [],
            }
        );
    }

    async generateCaseTableRows(subscriptionDataCases, language): Promise<any[]> {
        const caseRows = [];
        if (subscriptionDataCases.length) {
            subscriptionDataCases.sort(caseSubscriptionSorter);
            subscriptionDataCases.forEach(subscription => {
                caseRows.push(this.generateCaseTableRow(subscription, language));
            });
        }

        return caseRows;
    }

    async generateLocationTableRows(subscriptionDataCourts, language): Promise<any[]> {
        const courtRows = [];
        if (subscriptionDataCourts.length) {
            subscriptionDataCourts.sort(locationSubscriptionSorter);
            for (const subscription of subscriptionDataCourts) {
                const location = await locationService.getLocationById(subscription.locationId);
                courtRows.push(this.generateLocationTableRow(location, subscription, language));
            }
        }
        return courtRows;
    }

    private generateCaseTableRow(subscription, language): any {
        const caseName = subscription.caseName === null ? '' : subscription.caseName;
        const partyNames = subscription.partyNames === null ? '' : subscription.partyNames.split(',').join(',\n');
        let caseRef = subscription.searchType == 'CASE_ID' ? subscription.caseNumber : subscription.urn;
        caseRef = caseRef === null ? '' : caseRef;

        return {
            subscriptionId: subscription.subscriptionId,
            caseName: caseName,
            partyNames: partyNames,
            caseRef: caseRef,
            date: DateTime.fromISO(subscription.dateAdded, { zone: timeZone }).setLocale(language).toFormat(dateFormat),
        };
    }

    private generateLocationTableRow(location, subscription, language): any {
        return {
            subscriptionId: subscription.subscriptionId,
            locationName: language === 'cy' ? location.welshName : location.name,
            date: DateTime.fromISO(subscription.dateAdded, { zone: timeZone })
                .setLocale(language)
                .toFormat('dd MMMM yyyy'),
        };
    }

    public async unsubscribe(subscriptionId: string, userId: string): Promise<object> {
        return subscriptionRequests.unsubscribe(subscriptionId, userId);
    }

    public async bulkDeleteSubscriptions(subscriptionIds: string[], userId: string): Promise<object> {
        return subscriptionRequests.bulkDeleteSubscriptions(subscriptionIds, userId);
    }

    public async handleNewSubscription(pendingSubscription, user): Promise<void> {
        const selectionList = Object.keys(pendingSubscription);
        for (const selectionName of selectionList) {
            let hearingIdsList = [];
            let locationIdsList = [];
            let listTypesList = [];
            const listLanguageList = [];
            let caseDetailsList: object[];
            let courtDetailsList: object[];
            switch (selectionName) {
                case 'case-number':
                case 'case-number[]':
                    if (Array.isArray(pendingSubscription[`${selectionName}`])) {
                        hearingIdsList = pendingSubscription[`${selectionName}`];
                    } else {
                        hearingIdsList.push(pendingSubscription[`${selectionName}`]);
                    }
                    caseDetailsList = await this.getCaseDetailsByNumber(hearingIdsList, user);
                    await this.setPendingSubscriptions(caseDetailsList, 'cases', user.userId);
                    break;
                case 'case-urn':
                case 'case-urn[]':
                    if (Array.isArray(pendingSubscription[`${selectionName}`])) {
                        hearingIdsList = pendingSubscription[`${selectionName}`];
                    } else {
                        hearingIdsList.push(pendingSubscription[`${selectionName}`]);
                    }

                    caseDetailsList = await this.getCaseDetailsByUrn(hearingIdsList, user);
                    await this.setPendingSubscriptions(caseDetailsList, 'cases', user.userId);
                    break;
                case 'court-selections[]':
                    if (Array.isArray(pendingSubscription[`${selectionName}`])) {
                        locationIdsList = pendingSubscription[`${selectionName}`];
                    } else {
                        locationIdsList.push(pendingSubscription[`${selectionName}`]);
                    }

                    courtDetailsList = await this.getCourtDetails(locationIdsList);
                    await this.setPendingSubscriptions(courtDetailsList, 'courts', user.userId);
                    break;
                case 'list-selections[]':
                    if (Array.isArray(pendingSubscription[`${selectionName}`])) {
                        listTypesList = pendingSubscription[`${selectionName}`];
                    } else {
                        listTypesList.push(pendingSubscription[`${selectionName}`]);
                    }
                    await this.setPendingSubscriptions(listTypesList, 'listTypes', user.userId);
                    break;
                case 'list-language':
                    listLanguageList.push(pendingSubscription[`${selectionName}`].toUpperCase());

                    await this.setPendingSubscriptions(listLanguageList, 'listLanguage', user.userId);
                    break;
            }
        }
    }

    public async getCaseDetailsByNumber(cases, user): Promise<object[]> {
        const casesList = [];
        for (const caseNumber of cases) {
            const caseDetails = await publicationService.getCaseByCaseNumber(caseNumber, user.userId);
            if (caseDetails) {
                casesList.push(caseDetails);
            }
        }
        return casesList;
    }

    public async getCaseDetailsByUrn(cases, user): Promise<object[]> {
        const casesList = [];
        for (const caseUrn of cases) {
            const caseDetails = await publicationService.getCaseByCaseUrn(caseUrn, user.userId);
            if (caseDetails) {
                caseDetails['urnSearch'] = true;
                casesList.push(caseDetails);
            }
        }
        return casesList;
    }

    public async getCourtDetails(courts): Promise<Location[]> {
        const courtsList = [];
        for (const locationId of courts) {
            const courtDetails = await locationService.getLocationById(locationId);
            if (courtDetails) {
                courtsList.push(courtDetails);
            }
        }
        return courtsList;
    }

    public async setPendingSubscriptions(subscriptions, subscriptionType, userId): Promise<void> {
        await pendingSubscriptionsFromCache.setPendingSubscriptions(subscriptions, subscriptionType, userId);
    }

    public async getPendingSubscriptions(userId, subscriptionType): Promise<any[]> {
        return await pendingSubscriptionsFromCache.getPendingSubscriptions(userId, subscriptionType);
    }

    public async getSortedPendingSubscriptions(userId, subscriptionType, sorter): Promise<any[]> {
        const pendingSubscriptions = await this.getPendingSubscriptions(userId, subscriptionType);
        return pendingSubscriptions.sort(sorter);
    }

    public async subscribe(userId): Promise<boolean> {
        const cachedCaseSubs = await pendingSubscriptionsFromCache.getPendingSubscriptions(userId, 'cases');
        const caseSubscribed = cachedCaseSubs ? await this.subscribeByCase(userId, cachedCaseSubs) : true;

        const cachedCourtSubs = await pendingSubscriptionsFromCache.getPendingSubscriptions(userId, 'courts');
        let courtSubscribed = true;
        if (cachedCourtSubs.length > 0) {
            courtSubscribed = await this.subscribeByCourt(userId, cachedCourtSubs);

            const cachedListTypes = await pendingSubscriptionsFromCache.getPendingSubscriptions(userId, 'listTypes');
            const cachedListLanguage = await pendingSubscriptionsFromCache.getPendingSubscriptions(userId, 'listLanguage');
            courtSubscribed = await this.subscribeByListTypeAndLanguage(userId, cachedListTypes, cachedListLanguage);
        }

        return caseSubscribed && courtSubscribed;
    }

    private async subscribeByCase(userId, cachedCaseSubs) {
        let subscribed = true;
        for (const cachedCase of cachedCaseSubs) {
            const response = await subscriptionRequests.subscribe(
                this.createSubscriptionPayload(cachedCase, 'cases', userId),
                userId
            );

            if (response) {
                const caseRef = cachedCase.urnSearch
                    ? { 'case-urn': cachedCase.caseUrn }
                    : { 'case-number': cachedCase.caseNumber };
                await this.removeFromCache(caseRef, userId);
            } else {
                subscribed = false;
            }
        }
        return subscribed;
    }

    private async subscribeByCourt(userId, cachedCourtSubs) {
        let subscribed = true;
        for (const cachedCourt of cachedCourtSubs) {
            const response = await subscriptionRequests.subscribe(
                this.createSubscriptionPayload(cachedCourt, 'courts', userId),
                userId
            );

            if (response) {
                await this.removeFromCache({ court: cachedCourt.locationId }, userId);
            } else {
                subscribed = false;
            }
        }
        return subscribed;
    }

    private async subscribeByListTypeAndLanguage(userId, cachedListType, cachedLanguageType) {
        let userListTypeSubscription = await this.getUserSubscriptionListType(userId);

        if (userListTypeSubscription != null) {
            cachedListType = [...new Set([...cachedListType, ...userListTypeSubscription])]
        }

        let payload = {
            listType: cachedListType,
            listLanguage: cachedLanguageType[0].split(','),
            userId,
        };
        return await subscriptionRequests.addListTypeForLocationSubscriptions(userId, payload);
    }

    /*private async subscribeByListType(userId, cachedListType, cachedListLanguage): Promise<boolean> {
        return await this.configureListTypeForLocationSubscriptions(userId, cachedListType, cachedListLanguage);
    }*/

    createSubscriptionPayload(pendingSubscription, subscriptionType, userId): object {
        let payload;
        switch (subscriptionType) {
            case 'courts':
                payload = {
                    channel: 'EMAIL',
                    searchType: 'LOCATION_ID',
                    searchValue: pendingSubscription.locationId,
                    locationName: pendingSubscription.name,
                    userId,
                };
                break;
            case 'cases':
                payload = {
                    channel: 'EMAIL',
                    searchType: pendingSubscription.urnSearch ? 'CASE_URN' : 'CASE_ID',
                    searchValue: pendingSubscription.urnSearch
                        ? pendingSubscription.caseUrn
                        : pendingSubscription.caseNumber,
                    caseNumber: pendingSubscription.caseNumber,
                    caseName: pendingSubscription.caseName,
                    urn: pendingSubscription.caseUrn,
                    partyNames: pendingSubscription.partyNames.split(',\n').join(','),
                    userId,
                };
                break;
            default:
                payload = {
                    channel: 'EMAIL',
                    searchType: '',
                    searchValue: '',
                    userId,
                };
                break;
        }
        return payload;
    }

    public async configureListTypeForLocationSubscriptions(userId, listType, listLanguage): Promise<boolean> {
        return await subscriptionRequests.configureListTypeForLocationSubscriptions(userId, {
            listType: listType,
            listLanguage: listLanguage,
            userId,
        });
    }

    public createListTypeSubscriptionPayload(listType): object {
        let listTypeArray;
        if (listType) {
            if (!Array.isArray(listType)) {
                listTypeArray = listType.split(' ');
            } else {
                listTypeArray = listType;
            }
        } else {
            listTypeArray = [];
        }

        return listTypeArray;
    }

    public async removeFromCache(record, userId): Promise<void> {
        return await pendingSubscriptionsFromCache.removeFromCache(record, userId);
    }

    /**
     * This method generates the relevant list types for the courts that the user has configured.
     * @param userId The user ID of the user who is configuring their list types.
     * @param filterValuesQuery The currently selected filters.
     * @param clearQuery The clear filter for the query.
     */
    public async generateListTypesForCourts(
        userId,
        userRole,
        filterValuesQuery,
        clearQuery,
        language
    ): Promise<object> {
        let filterValues = filterService.stripFilters(filterValuesQuery);
        if (clearQuery) {
            filterValues = filterService.handleFilterClear(filterValues, clearQuery);
        }

        const applicableListTypes = await this.generateAppropriateListTypes(userId, userRole);

        return {
            listOptions: this.generateAlphabetisedListTypes(filterValues, applicableListTypes, language),
            filterOptions: this.buildFilterValueOptions(applicableListTypes, filterValues, language),
        };
    }

    private generateAlphabetisedListTypes(filterValues, applicableListTypes, language) {
        const alphabetisedListTypes = AToZHelper.generateAlphabetObject();

        if (filterValues.length == 0) {
            for (const [listName, listType] of applicableListTypes) {
                const listLocalisedName = this.getListLocalisedName(listType, language);
                alphabetisedListTypes[listLocalisedName.charAt(0).toUpperCase()][listName] = {
                    listFriendlyName: listLocalisedName,
                    checked: listType.checked,
                };
            }
        } else {
            for (const [listName, listType] of applicableListTypes) {
                const listLocalisedName = this.getListLocalisedName(listType, language);
                const hidden =
                    language === 'en'
                        ? !listType.jurisdictions.some(jurisdiction => filterValues.includes(jurisdiction))
                        : !listType.welshJurisdictions.some(jurisdiction => filterValues.includes(jurisdiction));

                alphabetisedListTypes[listLocalisedName.charAt(0).toUpperCase()][listName] = {
                    listFriendlyName: listLocalisedName,
                    checked: listType.checked,
                    hidden: hidden,
                };
            }
        }

        return alphabetisedListTypes;
    }

    private getListLocalisedName(listType, language): string {
        return language === 'en' ? listType.friendlyName : `${listType.friendlyName}\n${listType.welshFriendlyName}`;
    }

    private async getUserSubscriptionListType(userId): Promise<any[]> {
        const userSubscriptions = await this.getSubscriptionsByUser(userId);

        let selectedListTypes = [];
        if (userSubscriptions['locationSubscriptions'].length > 0) {
            selectedListTypes = userSubscriptions['locationSubscriptions'][0]['listType'];
        }
        return selectedListTypes;
    }

    private async generateAppropriateListTypes(userId, userRole): Promise<Map<string, ListType>> {
        const userSubscriptions = await this.getSubscriptionsByUser(userId);

        let selectedListTypes = await this.getUserSubscriptionListType(userId);
        const courtJurisdictions = [];
        for (const subscription of userSubscriptions['locationSubscriptions']) {
            if ('locationId' in subscription) {
                const returnedLocation = await locationService.getLocationById(subscription['locationId']);
                returnedLocation.jurisdiction.forEach(jurisdiction => courtJurisdictions.push(jurisdiction));
            }
        }

        return this.findApplicableListTypeForCourts(courtJurisdictions, selectedListTypes, userRole);
    }

    public async generateListTypeForCourts(userRole, language, userId): Promise<object> {
        const cacheService = new PendingSubscriptionsFromCache();
        const cachedCourts = await cacheService.getPendingSubscriptions(userId, 'courts');
        const courtsJurisdictions = await locationService.findCourtsJurisdiction(cachedCourts);

        const applicableListTypes = this.findApplicableListTypeForCourts(courtsJurisdictions, null, userRole);
        return this.generateAlphabetisedListTypes([], applicableListTypes, language);
    }

    private findApplicableListTypeForCourts(courtJurisdictions, selectedListTypes, userRole): Map<string, ListType> {
        const listTypes = publicationService.getListTypes();
        const sortedListTypes = new Map(
            [...listTypes].sort((a, b) => a[1]['friendlyName'].localeCompare(b[1]['friendlyName']))
        );

        const applicableListTypes = new Map();
        for (const [listName, listType] of sortedListTypes) {
            if (
                listType.jurisdictions.some(jurisdiction => courtJurisdictions.includes(jurisdiction)) &&
                (listType.restrictedProvenances.length === 0 || listType.restrictedProvenances.includes(userRole))
            ) {
                if (
                    selectedListTypes == null ||
                    selectedListTypes.length == 0 ||
                    selectedListTypes.includes(listName)
                ) {
                    listType.checked = true;
                } else {
                    listType.checked = false;
                }
                applicableListTypes.set(listName, listType);
            }
        }

        return applicableListTypes;
    }

    /**
     * Generates the appropriate list types for a location
     * @param location The location to get the list types for
     * @param userRole The role of the user.
     * @private
     */
    /*private async generateListTypesForNewSubscription(userId): Promise<Array<string>> {
        const userSubscriptions = await this.getSubscriptionsByUser(userId);
        if (userSubscriptions.locationSubscriptions != null && userSubscriptions.locationSubscriptions.length > 0) {
            return userSubscriptions.locationSubscriptions[0].listTypes;
        } else {
            return [];
        }
    }*/

    private buildFilterValueOptions(list: Map<string, ListType>, selectedFilters: string[], language): object {
        const filterValueOptions = {};
        filterValueOptions['Jurisdiction'] = {};

        const finalFilterValueOptions = this.getAllJurisdictions(list, language);

        [...finalFilterValueOptions]
            .sort((a, b) => a.localeCompare(b))
            .forEach(value => {
                filterValueOptions['Jurisdiction'][value] = {
                    value: value,
                    text: value,
                    checked: selectedFilters.includes(value),
                };
            });
        return filterValueOptions;
    }

    private getAllJurisdictions(list: Map<string, ListType>, language: string): string[] {
        const filterSet = new Set<string>();
        list.forEach(value => {
            if (language == 'en') {
                value.jurisdictions.forEach(jurisdiction => filterSet.add(jurisdiction));
            } else {
                value.welshJurisdictions.forEach(jurisdiction => filterSet.add(jurisdiction));
            }
        });

        return [...filterSet];
    }

    public async retrieveChannels(): Promise<string[]> {
        return await subscriptionRequests.retrieveSubscriptionChannels();
    }

    public async deleteLocationSubscription(locationId: number, requester: string): Promise<object> {
        return await subscriptionRequests.deleteLocationSubscription(locationId, requester);
    }
}
