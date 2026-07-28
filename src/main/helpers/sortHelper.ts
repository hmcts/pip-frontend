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

export const pendingWelshLocationSubscriptionSorter = (a, b) => {
    if (a.welshName > b.welshName) {
        return 1;
    } else if (a.welshName < b.welshName) {
        return -1;
    }
    return 0;
};

export const pendingListTypeSubscriptionSorter = (a, b) => {
    if (a > b) {
        return 1;
    } else if (a < b) {
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
    if (a.caseNumber === b.caseNumber) {
        return 0;
    } else if (!a.caseNumber) {
        return 1;
    } else if (!b.caseNumber) {
        return -1;
    }
    return a.caseNumber > b.caseNumber ? 1 : -1;
};
