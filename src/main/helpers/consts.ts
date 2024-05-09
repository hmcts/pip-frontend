const authenticationConfig = require('../authentication/authentication-config.json');

export const allowedFileTypes = ['pdf', 'json', 'csv', 'doc', 'docx', 'htm', 'html', 'xlsx'];

export const allowedImageTypes = ['jpg', 'jpeg', 'png', 'pdf'];

export const fileTypeMappings = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    pdf: 'application/pdf',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export const partyRoleMappings = {
    APPLICANT_PETITIONER: ['APL', 'APP', 'CLP20', 'CRED', 'OTH', 'PET'],
    APPLICANT_PETITIONER_REPRESENTATIVE: ['CREP', 'CREP20'],
    RESPONDENT: ['DEBT', 'DEF', 'DEF20', 'RES'],
    RESPONDENT_REPRESENTATIVE: ['DREP', 'DREP20', 'RREP'],
    PROSECUTING_AUTHORITY: [],
    DEFENDANT: [],
    DEFENDANT_REPRESENTATIVE: [],
};

export const allowedCsvFileTypes = ['csv'];

export enum uploadType {
    IMAGE,
    FILE,
    CSV,
}

export enum FileType {
    PDF = 'pdf',
    EXCEL = 'xlsx',
}

export const formattedRoles = {
    VERIFIED: 'Verified',
    INTERNAL_ADMIN_CTSC: 'CTSC Admin',
    INTERNAL_ADMIN_LOCAL: 'Local Admin',
    INTERNAL_SUPER_ADMIN_CTSC: 'CTSC Super Admin',
    INTERNAL_SUPER_ADMIN_LOCAL: 'Local Super Admin',
    SYSTEM_ADMIN: 'System Admin',
};

export const formattedProvenances = {
    PI_AAD: 'B2C',
    CFT_IDAM: 'CFT IdAM',
    CRIME_IDAM: 'Crime IdAM',
};

export const reSignInUrls = {
    CFT: '/cft-login',
    AAD: `/login?p=${authenticationConfig.POLICY}`,
    ADMIN: `/admin-login?p=${authenticationConfig.ADMIN_POLICY}`,
};

export const thirdPartyRoles = [
    {
        key: 'GENERAL_THIRD_PARTY',
        name: 'General third party',
        description: 'User allowed access to public and private publications only'
    },
    {
        key: 'VERIFIED_THIRD_PARTY_CFT',
        name: 'Verified third party - CFT',
        description: 'User allowed access to classified publications for CFT list types'
    },
    {
        key: 'VERIFIED_THIRD_PARTY_CRIME',
        name: 'Verified third party - Crime',
        description: 'User allowed access to classified publications for Crime list types'
    },
    {
        key: 'VERIFIED_THIRD_PARTY_PRESS',
        name: 'Verified third party - Press',
        description: 'User allowed access to classified publications for Press list types'
    },
    {
        key: 'VERIFIED_THIRD_PARTY_CRIME_CFT',
        name: 'Verified third party - CFT and Crime',
        description: 'User allowed access to classified publications for Crime and CFT list types'
    },
    {
        key: 'VERIFIED_THIRD_PARTY_CFT_PRESS',
        name: 'Verified third party - CFT and Press',
        description: 'User allowed access to classified publications for CFT and Press list types'
    },
    {
        key: 'VERIFIED_THIRD_PARTY_CRIME_PRESS',
        name: 'Verified third party - Crime and Press',
        description: 'User allowed access to classified publications for Crime and Press list types'
    },
    {
        key: 'VERIFIED_THIRD_PARTY_ALL',
        name: 'Verified third party - All',
        description: 'User allowed access to classified publications for all list types'
    }
]
