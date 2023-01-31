import fs from 'fs';
import path from 'path';

export class LanguageFileParser {
    public getLanguageFileJson(fileName, language): string {
        const localesPath = '../resources/locales/' + language;
        const filePath = path.resolve(__dirname, localesPath, fileName + '.json');
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(rawData);
    }

    public getText(fileJson, parentNode, subNode): string {
        if (!parentNode) {
            return fileJson[subNode];
        } else {
            return fileJson[parentNode][subNode];
        }
    }
}
