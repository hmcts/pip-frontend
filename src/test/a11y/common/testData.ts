import fs from 'fs';
import path from 'path';

export const testArtefactJsonData = (filename: string) => {
    const rawData = fs.readFileSync(path.resolve(__dirname, `../../unit/mocks/${filename}`), 'utf-8');
    return JSON.parse(rawData);
};

export const testArtefactMetadata = () => {
    const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');
    return JSON.parse(rawMetadata);
};

export const testLocationData = () => {
    const rawLocationData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/courtAndHearings.json'), 'utf-8');
    return JSON.parse(rawLocationData);
};

export const testSubscriptionData = () => {
    const rawSubscriptionData = fs.readFileSync(
        path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptions.json'),
        'utf-8'
    );
    return JSON.parse(rawSubscriptionData).data;
};


export const testMediaApplicationData = () => {
    const rawMediaApplications = fs.readFileSync(
        path.resolve(__dirname, '../../unit/mocks/mediaApplications.json'),
        'utf-8'
    );
    return JSON.parse(rawMediaApplications);
};

export const testUserData = (userProvenance = 'PI_AAD', role = 'VERIFIED') => {
    return {
        userId: '1',
        userProvenance: userProvenance,
        provenanceUserId: '123',
        email: 'test@test.com',
        roles: role,
        createdDate: '2023-06-12 11:32:59.444111',
    };
};

export const testAuditData = () => {
    return {
        userId: '1',
        userEmail: 'test@test.com',
        roles: 'VERIFIED',
        userProvenance: 'PI_AAD',
        action: 'MANAGE_USER',
        details: 'Details',
        timestamp: '2023-06-12 11:32:59.444111',
    };
};
