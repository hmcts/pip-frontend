export const multerFile = (fileName: string, size: number): File => {
    const mFile = {
        fieldname: 'manual-file-upload',
        originalname: fileName,
        encoding: '7bit',
        mimetype: 'application/pdf',
        destination: 'manualUpload/tmp/',
        filename: fileName,
        path: `manualUpload/tmp/${fileName}`,
        size: size,
    } as unknown as File;
    return mFile;
};
