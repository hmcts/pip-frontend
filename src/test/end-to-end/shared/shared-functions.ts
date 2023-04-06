import fs from 'fs';
import { randomData } from './random-data';
import path from 'path/posix';
import os from 'os';

const mockLocationFilePrefix = 'mock-location-';

const locationJsonData = (id, name) => {
    return [
        {
            'P&I ID': id,
            'Court Desc': name,
            'Welsh Court Desc': name,
            Region: 'South East',
            'Welsh Region': 'De-ddwyrain Lloegr',
            Jurisdiction: 'Family; Civil',
            'Welsh Jurisdiction': 'Llys Sifil; Llys Teulu',
            Provenance: 'ListAssist',
            'Provenance Location ID': '3482',
            'Provenance Location Type': 'Venue',
        },
    ];
};

const generateTestLocationFields = (): [number, string] => {
    // Generate a random test court ID between 200 and 1000000
    const id = randomData.getRandomNumber(200, 1000000);
    return [id, `TestCourt${id}`];
};

const jsonToCsv = (json): string => {
    const objectKeys = Object.keys(json[0]);
    const headers = objectKeys.join(',');

    const replacer = (key, value) => value ?? '';
    const rows = json.map(row => objectKeys.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    return [headers, ...rows].join('\n');
};

export function generateTestLocation(): [string, string, string] {
    const [id, name] = generateTestLocationFields();
    const fileName = mockLocationFilePrefix + id + '.csv';

    const filePath = path.join(os.tmpdir(), fileName);
    const csvData = jsonToCsv(locationJsonData(id, name));

    try {
        fs.writeFileSync(filePath, csvData);
    } catch (err) {
        console.log('Failed to generate mock location test data');
    }

    return [id.toString(), name, fileName];
}

export function removeTestLocationFile(fileName) {
    const filePath = path.join(os.tmpdir(), fileName);
    fs.unlinkSync(filePath);
}

export function padFormatted(value) {
    return value.toString().padStart(2, '0');
}
