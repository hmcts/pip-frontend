export const allowedFileTypes = ['pdf', 'json', 'csv', 'doc', 'docx', 'htm', 'html', 'xlsx'];

export const allowedImageTypes = ['jpg', 'jpeg', 'png', 'pdf'];

export const allowedImageTypeMappings = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  pdf: 'application/pdf',
};

export const partyRoleMappings = {
  APPLICANT_PETITIONER: ['APL', 'APP', 'CLP20', 'CRED', 'OTH', 'PET'],
  APPLICANT_PETITIONER_REPRESENTATIVE: ['CREP', 'CREP20'],
  RESPONDENT: ['DEBT', 'DEF', 'DEF20', 'RES'],
  RESPONDENT_REPRESENTATIVE: ['DREP', 'DREP20', 'RREP'],
  PROSECUTING_AUTHORITY: [],
  DEFENDANT: [],
};

export const allowedLocationUploadFileTypes = ['csv'];

export enum uploadType {
  IMAGE,
  FILE,
  REFERENCE_DATE,
}
