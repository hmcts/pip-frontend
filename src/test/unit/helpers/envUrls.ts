import { urlPath } from '../../../main/helpers/envUrls';
import { expect } from 'chai';

const expectedPath = 'myPath/subPath';

describe('get url path', () => {
    it('return url path without forward slash', () => {
        expect(urlPath('myPath/subPath')).to.equal(expectedPath);
    });

    it('return url path with forward slash', () => {
        expect(urlPath('/myPath/subPath')).to.equal(expectedPath);
    });

    it('return url path with query string', () => {
        expect(urlPath('/myPath/subPath?param1=value&param2=true')).to.equal(expectedPath);
    });
});
