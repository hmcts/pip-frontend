import authenticationConfig from '../authentication/authentication-config.json';

export const allowedFileTypes = ['pdf', 'json', 'csv', 'doc', 'docx', 'htm', 'html', 'xlsx'];

export const allowedImageTypes = ['jpg', 'jpeg', 'png', 'pdf'];

export const allowedNonStrategicFileTypes = ['xlsx'];

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
    NON_STRATEGIC_FILE,
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
    SSO: 'SSO',
};

export const reSignInUrls = {
    CFT: '/cft-login',
    AAD: `/login?p=${authenticationConfig.POLICY}`,
    SSO: '/sso-login',
};

export const ssoNotAuthorised = 'NOT_AUTHORISED';
