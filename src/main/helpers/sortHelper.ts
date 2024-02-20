export const locationSubscriptionSorter = (a, b) => {
    if (a.locationName > b.locationName) {
        return 1;
    } else if (a.locationName < b.locationName) {
        return -1;
    }
    return 0;
};

export const pendingLocationSubscriptionSorter = (a, b) => {
    if (a.name > b.name) {
        return 1;
    } else if (a.name < b.name) {
        return -1;
    }
    return 0;
};

export const caseSubscriptionSorter = (a, b) => {
    const result = compareByCaseName(a, b);
    if (result === 0) {
        return compareSubscriptionByCaseRef(a, b);
    }
    return result;
};

export const pendingCaseSubscriptionSorter = (a, b) => {
    const result = compareByCaseName(a, b);
    if (result === 0) {
        return comparePendingSubscriptionByCaseRef(a, b);
    }
    return result;
};

const compareByCaseName = (a, b) => {
    let result;
    if (a.caseName === b.caseName) {
        result = 0;
    } else if (!a.caseName) {
        return 1;
    } else if (!b.caseName) {
        return -1;
    }
    if (result != 0) {
        return a.caseName > b.caseName ? 1 : -1;
    }
    return result;
};

const compareSubscriptionByCaseRef = (a, b) => {
    const caseRefA = a.searchType == 'CASE_ID' ? a.caseNumber : a.urn;
    const caseRefB = b.searchType == 'CASE_ID' ? b.caseNumber : b.urn;

    if (caseRefA === caseRefB) {
        return 0;
    } else if (caseRefA === null) {
        return 1;
    } else if (caseRefB === null) {
        return -1;
    }
    return caseRefA > caseRefB ? 1 : -1;
};

const comparePendingSubscriptionByCaseRef = (a, b) => {
    const caseRefA = a.caseNumber ? a.caseNumber : a.caseUrn;
    const caseRefB = b.caseNumber ? b.caseNumber : b.caseUrn;

    if (caseRefA === caseRefB) {
        return 0;
    } else if (caseRefA === null) {
        return 1;
    } else if (caseRefB === null) {
        return -1;
    }
    return caseRefA > caseRefB ? 1 : -1;
};
