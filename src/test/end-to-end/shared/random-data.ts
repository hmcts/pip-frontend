import { config as testConfig } from '../../config';

const randomNumber = (min = 1, max = 100) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

const randomLocationId = (min = 10000, max = 99999) => {
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

const randomString = (length = 10) => {
    return Math.random().toString(36).substring(2, length);
};

const randomAlphabeticString = (length = 10) => {
    let randomString = '';
    let randomAscii;
    for (let i = 0; i < length; i++) {
        randomAscii = Math.floor(Math.random() * 25 + 97);
        randomString += String.fromCharCode(randomAscii);
    }
    return randomString;
};

export const randomData = {
    getRandomLocationId: randomLocationId,
    getRandomNumber: randomNumber,
    getRandomString: randomString,
    getRandomAlphabeticString: randomAlphabeticString,
    getRandomEmailAddress: testWorkerNumber =>
        testConfig.TEST_SUITE_PREFIX + testWorkerNumber + randomString() + '@justice.gov.uk',
};
