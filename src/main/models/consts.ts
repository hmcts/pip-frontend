export const allowedFileTypes = [
  'pdf',
  'json',
  'csv',
  'doc',
  'docx',
  'htm',
  'html',
];

export const allowedImageTypes = [
  'jpg',
  'jpeg',
  'png',
  'pdf',
];

export const allowedImageTypeMappings = {
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'pdf': 'application/pdf',
};

export const partyRoleMappings = {
  'APPLICANT_PETITIONER': ['Appellant', 'Applicant', 'Claimant (Part 20)', 'Creditor', 'Claimant', 'Petitioner'],
  'APPLICANT_PETITIONER_REPRESENTATIVE': ['Claimant\'s Representative', 'Claimant\'s Representative (Part 20)'],
  'RESPONDENT': ['Debtor', 'Defendant', 'Defendant (Part 20)', 'Respondent'],
  'RESPONDENT_REPRESENTATIVE': ['Defendant\'s Representative', 'Defendant\'s Representative (Part 20)', 'Respondent\'s Representative'],
};
