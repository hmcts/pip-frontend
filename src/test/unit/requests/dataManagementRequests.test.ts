import { DataManagementRequests } from '../../../main/resources/requests/DataManagementRequests';
import { dataManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import sinon from 'sinon';
import superagent from 'superagent';

const errorResponse = {
    response: {
        data: 'test error',
    },
};

const errorMessage = {
    message: 'test',
};

const mockUploadFileBody = { file: '', fileName: '' };
const mockUploadFileHeaders = { foo: 'bar' };
const fileUploadAPI = new DataManagementRequests();

describe('Data Management requests', () => {
    describe('upload publication', () => {
        beforeEach(async () => {
            sinon.restore();
            const axiosConfig = await import('../../../main/resources/requests/utils/axiosConfig');
            sinon.stub(axiosConfig, 'getDataManagementCredentials').returns(() => {
                return '';
            });
        });

        it('should return true on success', async () => {
            // chain call for superagent post.set.set.attach
            sinon.stub(superagent, 'post').callsFake(() => {
                return {
                    set(): any {
                        return {
                            set(): any {
                                return { attach: sinon.stub().returns({ status: 200, body: { artefactId: '123' } }) };
                            },
                        };
                    },
                };
            });

            expect(await fileUploadAPI.uploadPublication(mockUploadFileBody, mockUploadFileHeaders, false)).toBe('123');
        });

        it('should return error response', async () => {
            sinon.stub(superagent, 'post').callsFake(() => {
                return {
                    set(): any {
                        return {
                            set(): any {
                                return { attach: sinon.stub().rejects(errorResponse) };
                            },
                        };
                    },
                };
            });
            expect(
                await fileUploadAPI.uploadPublication({ file: '', fileName: 'foo' }, mockUploadFileHeaders, false)
            ).toBe(null);
        });

        it('should return error message', async () => {
            sinon.stub(superagent, 'post').callsFake(() => {
                return {
                    set(): any {
                        return {
                            set(): any {
                                return { attach: sinon.stub().rejects(errorMessage) };
                            },
                        };
                    },
                };
            });
            expect(
                await fileUploadAPI.uploadPublication({ file: '', fileName: 'baz' }, mockUploadFileHeaders, false)
            ).toBe(null);
        });
    });

    describe('upload non-strategic publication', () => {
        beforeEach(async () => {
            sinon.restore();
            const axiosConfig = await import('../../../main/resources/requests/utils/axiosConfig');
            sinon.stub(axiosConfig, 'getDataManagementCredentials').returns(() => {
                return '';
            });
        });

        it('should return true on success', async () => {
            // chain call for superagent post.set.set.attach
            sinon.stub(superagent, 'post').callsFake(() => {
                return {
                    set(): any {
                        return {
                            set(): any {
                                return { attach: sinon.stub().returns({ status: 200, body: { artefactId: '123' } }) };
                            },
                        };
                    },
                };
            });

            expect(await fileUploadAPI.uploadPublication(mockUploadFileBody, mockUploadFileHeaders, true)).toBe('123');
        });

        it('should return error response', async () => {
            sinon.stub(superagent, 'post').callsFake(() => {
                return {
                    set(): any {
                        return {
                            set(): any {
                                return { attach: sinon.stub().rejects(errorResponse) };
                            },
                        };
                    },
                };
            });
            expect(
                await fileUploadAPI.uploadPublication({ file: '', fileName: 'foo' }, mockUploadFileHeaders, true)
            ).toBe(null);
        });

        it('should return error message', async () => {
            sinon.stub(superagent, 'post').callsFake(() => {
                return {
                    set(): any {
                        return {
                            set(): any {
                                return { attach: sinon.stub().rejects(errorMessage) };
                            },
                        };
                    },
                };
            });
            expect(
                await fileUploadAPI.uploadPublication({ file: '', fileName: 'baz' }, mockUploadFileHeaders, true)
            ).toBe(null);
        });
    });

    describe('upload json publication', () => {
        it('should return true on success', async () => {
            sinon.restore();
            sinon
                .stub(dataManagementApi, 'post')
                .withArgs('/publication')
                .resolves({ status: 200, data: { artefactId: '123' } });
            expect(await fileUploadAPI.uploadJSONPublication({ file: '' }, {})).toBe('123');
        });

        it('should return error response', async () => {
            sinon.restore();
            sinon.stub(dataManagementApi, 'post').withArgs('/publication').rejects(errorResponse);
            expect(await fileUploadAPI.uploadJSONPublication({ file: 'foo' }, { headers: {} })).toBe(null);
        });

        it('should return error message', async () => {
            sinon.restore();
            sinon.stub(dataManagementApi, 'post').withArgs('/publication').rejects(errorMessage);
            expect(await fileUploadAPI.uploadJSONPublication({ file: 'baz' }, { headers: {} })).toBe(null);
        });
    });

    describe('upload reference data', () => {
        beforeEach(async () => {
            sinon.restore();
            const axiosConfig = await import('../../../main/resources/requests/utils/axiosConfig');
            sinon.stub(axiosConfig, 'getDataManagementCredentials').returns(() => {
                return '';
            });
        });

        it('should return true on success', async () => {
            sinon.stub(superagent, 'post').callsFake(() => {
                return {
                    set(): any {
                        return {
                            set(): any {
                                return { attach: sinon.stub().returns(true) };
                            },
                        };
                    },
                };
            });

            expect(await fileUploadAPI.uploadLocationFile(mockUploadFileBody)).toBe(true);
        });

        it('should return error response', async () => {
            sinon.stub(superagent, 'post').callsFake(() => {
                return {
                    set(): any {
                        return {
                            set(): any {
                                return { attach: sinon.stub().rejects(errorResponse) };
                            },
                        };
                    },
                };
            });
            expect(await fileUploadAPI.uploadLocationFile({ file: '', fileName: 'foo' })).toBe(false);
        });

        it('should return error message', async () => {
            sinon.stub(superagent, 'post').callsFake(() => {
                return {
                    set(): any {
                        return {
                            set(): any {
                                return { attach: sinon.stub().rejects(errorMessage) };
                            },
                        };
                    },
                };
            });
            expect(await fileUploadAPI.uploadLocationFile({ file: '', fileName: 'baz' })).toBe(false);
        });
    });
});
